import {
  CheckForRepeatOrder,
  CreateOrder,
  DeleteOrderByItem,
  EditOrder,
  GetTodaysOrder,
  GetUserOrderDetails,
  RepeatOrderByUserId,
  UpdateUpiIDByUserId
} from "~/db/order";
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
  if (formData?.get("updateUpi") === "true") {
    const upiId = formData?.get("upiId") as string;
    const id = formData?.get("id") as string;
    const data = await UpdateUpiIDByUserId(id, upiId)
    return {
      success: data,
      message: 'UPI Id updated successfully!'
    }
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
  if (!data) return false;
  const repeatOrderData = {
    ...Constants.Drinks?.[data?.repeatOrderData as Drink],
    name: data?.repeatOrderData,
    userData: {
      email: data?.userData?.email,
      empId: data?.userData?.empId,
      upiId: data?.userData?.upiId ?? undefined
    },
  }
  return { ...repeatOrderData };
}

export async function RepeatOrder(id: string, drink: string) {
  const drinkDetails = { ...Constants.Drinks?.[drink as Drink], name: drink };
  const data = await RepeatOrderByUserId(id, drinkDetails)
  return {
    data: {
      success: data,
      message: 'Success. ബാ ഇനി ഓരോ ചായ പിടിപ്പിക്കാം'
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
  const drinkDetails = Constants.Drinks;
  const itemDetails = data.reduce((details, obj) => {
    const { item } = obj.orderDetails;
    const { email } = obj;
    if (!details[item]) {
      details[item] = { count: 0, emails: new Set(), parent: undefined };
    }
    details[item].count += 1;
    details[item].emails.add(getNameFromEmail(email));
    details[item].parent = (drinkDetails[item as Drink] as DrinkDetails)?.parent
    return details;
  }, {});

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

  let totalPrice = 0
  const pricePerItem: { itemName: string; itemPrice: number; }[] = []
  const commonDrinks = (result?.common.map((drink:  { item: Drink, count: number, emails: string[] }) => { return { ...Constants.Drinks[drink?.item], count: drink?.count, emails: drink?.emails, key: drink.item }}))
  const uniqueDrinks = (result?.unique.map((drink:  { item: Drink, count: number, emails: string[] }) => { return { ...Constants.Drinks[drink?.item], count: drink?.count, emails: drink?.emails, key: drink.item }}))
  const commonOrders: {label: string, count: number, emails: string[], key: string, price: number}[] = [];
  const uniqueOrders: {label: string, count: number, emails: string[], key: string, price: number}[] = [];
  commonDrinks.map((drink) => {
    totalPrice = totalPrice + drink?.count * drink?.price;
    pricePerItem.push({ itemName: drink?.label, itemPrice: drink?.price })
    return commonOrders.push({ label: drink?.label, count: drink?.count, emails: drink?.emails, key: drink?.key, price: drink?.price })})
  uniqueDrinks.map((drink) => {
    totalPrice = totalPrice + drink?.count * drink?.price;
    pricePerItem.push({ itemName: drink?.label, itemPrice: drink?.price })
    return uniqueOrders.push({ label: drink?.label, count: drink?.count, emails: drink?.emails, key: drink?.key, price: drink?.price })})

//   const updatedItemDetails = itemDetails;
//   const finalTotal: {
//     label?: string;
//     count?: number;
//   } | unknown[] = [];
// // Ensure all parent items exist and aggregate counts/emails
// for (const key in itemDetails) {
//   const { parent, count, emails } = itemDetails[key];

//   if (parent) {
//     // If parent doesn't exist in updatedItemDetails, initialize it
//     if (!updatedItemDetails[parent]) {
//       updatedItemDetails[parent] = {
//         count: 0,
//         emails: new Set(),
//         parent: undefined
//       };
//     }

//     // Merge child count into parent
//     updatedItemDetails[parent].count += count;

//     // Merge emails correctly using Set
//     updatedItemDetails[parent].emails = new Set([
//       ...updatedItemDetails[parent].emails || [],
//       ...emails
//     ]);
//   }
// }

// // Convert Sets to Arrays for final output
// const finalItemDetails = Object.fromEntries(
//   Object.entries(updatedItemDetails).map(([key, item]) => [
//     key,
//     { ...item, emails: Array.from(item.emails) }
//   ])
// );

//   Object.entries(finalItemDetails)?.map((x) => finalTotal.push({label: drinkDetails?.[x[0] as Drink]?.label, count: x[1]?.count}))
//   console.log("🚀 ~ GetTodaysConsolidatedOrder ~ mergedItemDetails:", finalItemDetails)

  return {
    commonDrinks: commonOrders,
    uniqueDrinks: uniqueOrders,
    resultOrderInWords: finalResult.sort((a, b) => b.count.total - a.count.total),
    priceDetails: {
      total: totalPrice,
      pricePerItem
    },
    // finalTotal
  };
}
