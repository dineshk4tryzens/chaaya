import { CheckForRepeatOrder, CreateOrder, DeleteOrderByItem, EditOrder, GetTodaysOrder, GetUserOrderDetails, RepeatOrderByUserId } from "~/db/order";
import { DrinkDetails } from "~/types/drink";
import { OrderDetailsResponse } from "~/types/order";
import { Constants } from "./constants";
import { getNameFromEmail } from "./convertEmailToName";
import { Drink } from "~/types";
import.meta.env
export async function Order(request: Request) {
  const formData = await request.formData();
  const reorder = formData.get('reorder') === 'true'
  if (reorder) {
    const id = formData.get('id') as string;
    const drink = formData.get('drink') as string;
    if (!id || !drink) throw new Error('missing id or drink to repeat order')
    const createdOrder = await RepeatOrder(id, drink)
    return {
      ...createdOrder,
    };
  }
  if (formData?.get("editDrink") === "true") {
    const userId = formData.get("userId") as string
    const editDrinkDetailsFormData = formData.get("updateDrinkDetails") as string
    if (!editDrinkDetailsFormData) throw new Error('Missing updated drink details');
    const editDrinkDetails = JSON.parse(editDrinkDetailsFormData)
    const newItemKey = Object.entries(Constants.Drinks).find(
      ([, drink]) => drink.label === editDrinkDetails?.orderValue
    )?.[0];
    const order = await EditOrder({
      userId ,
      orderId: editDrinkDetails?.orderId,
      orderValue: editDrinkDetails?.orderValue,
      newItemKey,
    })
    return order;
  }
  const id = formData.get("id") as string;
  const drink = formData.get("drink") as string;
  const email = formData.get("email") as string;
  const empId = formData.get("empId") as string;
  if (!id && (!email || !empId)) throw new Error("Missing email or empId");
  const drinkDetails = JSON.parse(drink) as DrinkDetails;

  if (!drinkDetails?.name || !drinkDetails?.price)
    throw new Error("Missing name or price in order details");
  const data = await CreateOrder({
    email,
    empId,
    id: id ?? undefined,
    orderDetails: {
      item: drinkDetails?.name,
      orderDate: new Date().toISOString(),
      price: drinkDetails?.price,
    },
  });
  return data;
}

export async function DeleteOrder(id: string, deleteItemId: string) {
  const data = await DeleteOrderByItem(id, deleteItemId)
  return data;
}

export async function CheckIfRepeatOrderExists(id: string) {
  const data = await CheckForRepeatOrder(id)
  return { ...Constants.Drinks?.[data as Drink], name: data };
}

export async function RepeatOrder(id: string, drink: string) {
  const drinkDetails = { ...Constants.Drinks?.[drink as Drink], name: drink };
  const data = await RepeatOrderByUserId(id, drinkDetails)
  return {
    data: {
      success: data
    },
    success: data
  };
}

export async function GetOrders(request: Request) {
  const url = new URL(request?.url);
  const userId = url?.searchParams?.get("user");
  if (!userId)
    return {
      status: 500,
      message: "You dont have the required permissions to access this page!",
    };

  const data = await GetUserOrderDetails({
    id: userId,
  });

  data?.orderDetails.map((order: OrderDetailsResponse) => {
    // const createdDate = order?.orderDate;
    const isoDate = order?.orderDate;

    // Create a Date object from the ISO string (this will be in UTC)
    const date = new Date(isoDate);

    // Convert UTC time to IST (UTC +5:30)
    const istDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    ); // Add 5 hours 30 minutes

    // Format the date as DD/MM/YYYY HH:MM AM/PM in IST
    const options = {
      day: "2-digit" as "2-digit" | undefined,
      month: "2-digit" as "2-digit" | undefined,
      year: "numeric" as "numeric" | undefined,
      hour: "2-digit" as "2-digit" | undefined,
      minute: "2-digit" as "2-digit" | undefined,
      hour12: true, // 12-hour format with AM/PM
    };

    const formattedDate = istDate
      .toLocaleString("en-IN", options)
      .replace(",", "")
      .replace(/:/g, ":");

    const itemDetails = Constants.Drinks[order?.item as keyof object];

    order.orderDate = formattedDate;
    order.item = (itemDetails as DrinkDetails).label as string
    return order;
  });

  return data;
}

export async function GetTodaysConsolidatedOrder() {
  const data = await GetTodaysOrder();
  /**const itemDetails = data.reduce((details, obj) => {
    const { item } = obj.orderDetails;
    const { email } = obj;
    if (!details[item]) {
      details[item] = { count: 0, emails: new Set() };
    }
    details[item].count += 1;
    details[item].emails.add(getNameFromEmail(email));
    return details;
  }, {});
  const drinkDetails = Constants.Drinks;
  const resultOrderInWords = [];
  const processedKeys = new Set(); // Track processed items

  // Process parent-child relationships
  for (const [key, detail] of Object.entries(itemDetails)) {
    if (processedKeys.has(key)) continue; // Skip if already processed

    const parent = (drinkDetails[key as Drink] as DrinkDetails)?.parent;
    const parentLabel = drinkDetails[parent as Drink]?.label;
    const childLabel = drinkDetails[key as Drink]?.label;
    if (parent && itemDetails[parent]) {
      // Combine parent and child
      const parentDetail = itemDetails[parent];
      const total = detail.count + parentDetail.count;

      resultOrderInWords.push({
        // key: parent,
        label: `${total} ${parentLabel} il ${detail.count} ${childLabel}`,
        count: {
          total,
          // [key]: detail.count,
          // [parent]: parentDetail.count,
        },
        // emails: {
        //   [key]: Array.from(detail.emails),
        //   [parent]: Array.from(parentDetail.emails),
        // },
      });

      processedKeys.add(key);
      processedKeys.add(parent);
    } else if (!processedKeys.has(key)) {
      // Standalone item
      resultOrderInWords.push({
        // key,
        label: `${detail.count} ${childLabel}`,
        count: {
          total: detail.count,
          // [key]: detail.count
        },
        // emails: { [key]: Array.from(detail.emails) },
      });
      processedKeys.add(key);
    }
  } **/
   
    const itemDetails = data.reduce((details, obj) => {
      const { item } = obj.orderDetails;
      const { email } = obj;
      if (!details[item]) {
        details[item] = { count: 0, emails: new Set() };
      }
      details[item].count += 1;
      details[item].emails.add(getNameFromEmail(email));
      return details;
    }, {});
    
    const drinkDetails = Constants.Drinks;
    const resultOrderInWords = [];
    const processedKeys = new Set(); // Track processed items
    const mergedLabels = new Set(); // To track merged parent labels
    const labelCountMap = new Map(); // To track count for each label
    
    // Step 1: Process parent-child relationships
    for (const [key, detail] of Object.entries(itemDetails)) {
      if (processedKeys.has(key)) continue; // Skip if already processed
    
      const parent = (drinkDetails[key as Drink] as DrinkDetails)?.parent;
      const parentLabel = drinkDetails[parent as Drink]?.label;
      const childLabel = drinkDetails[key as Drink]?.label;
    
      if (parent && itemDetails[parent]) {
        // Combine parent and child
        const parentDetail = itemDetails[parent];
        const total = detail.count + parentDetail.count;
    
        // Store the merged label and count
        const mergedLabel = `${total} ${parentLabel} il ${detail.count} ${childLabel}`;
        resultOrderInWords.push({
          label: mergedLabel,
          count: { total }
        });
    
        processedKeys.add(key);
        processedKeys.add(parent);
        mergedLabels.add(parentLabel); // Mark the parent as merged
        labelCountMap.set(parentLabel, total); // Track merged counts
      } else if (!processedKeys.has(key)) {
        // Standalone item
        resultOrderInWords.push({
          label: `${detail.count} ${childLabel}`,
          count: { total: detail.count }
        });
    
        processedKeys.add(key);
      }
    }
    
    // Step 2: Ensure merged labels appear and filter out unnecessary standalone items
    const finalResult = resultOrderInWords.filter(({ label }) => {
      // Extract the main label (parent label, which is the first word)
      const mainLabel = label.split(' ')[1]; // e.g., 'Tea' from '6 Tea'
    
      // Keep merged labels and exclude standalone ones that are already merged
      if (label.includes('il')) {
        return true; // Keep merged labels
      }
    
      // Exclude standalone labels already covered by merged labels
      return !mergedLabels.has(mainLabel);
    });
    
    // console.log(finalResult);
    

  // Separate into "common" and "unique"
  const result = Object.entries(itemDetails).reduce(
    (acc, [item, { count, emails }]) => {
      const emailList = Array.from(emails); // Convert Set to Array
      if (count > 1) {
        (acc.common as {[key: string]: string | unknown[]}[]).push({ item, count, emails: emailList });
      } else {
        (acc.unique as {[key: string]: string | unknown[]}[]).push({ item, count, emails: emailList });
      }
      return acc;
    },
    { common: [], unique: [] }
  );
  const commonDrinks = (result?.common.map((drink:  { item: Drink, count: number, emails: string[] }) => { return { ...Constants.Drinks[drink?.item], count: drink?.count, emails: drink?.emails, key: drink.item }}))
  const uniqueDrinks = (result?.unique.map((drink:  { item: Drink, count: number, emails: string[] }) => { return { ...Constants.Drinks[drink?.item], count: drink?.count, emails: drink?.emails, key: drink.item }}))
  const commonOrders: {label: string, count: number, emails: string[], key: string, price: number}[] = [];
  const uniqueOrders: {label: string, count: number, emails: string[], key: string, price: number}[] = [];
  commonDrinks.map((drink) => commonOrders.push({ label: drink?.label, count: drink?.count, emails: drink?.emails, key: drink?.key, price: drink?.price }))
  uniqueDrinks.map((drink) => uniqueOrders.push({ label: drink?.label, count: drink?.count, emails: drink?.emails, key: drink?.key, price: drink?.price }))
  return {
    commonDrinks: commonOrders,
    uniqueDrinks: uniqueOrders,
    resultOrderInWords: finalResult.sort((a, b) => b.count.total - a.count.total)
  };
}
