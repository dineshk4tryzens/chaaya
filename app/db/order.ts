import { BSON, Document, Filter, InsertOneResult, MongoClient, PushOperator, UpdateFilter, UUID, WithId } from "mongodb";
import Connection from "./main";
import { CreateOrderPayload, InsertedRecord, GetOrderPayload, EditOrderPayload, OrderDetailsResponse } from "~/types/order";
import { getNameFromEmail } from "~/data/convertEmailToName";
import { DrinkDetails } from "~/types/drink";

export async function CreateOrder(params: CreateOrderPayload) {
  const id = params?.id;
  const email = params?.email;
  const empId = params?.empId;
  const orderDetails = { ...params?.orderDetails, id: new UUID()};
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");

  const userExist = await connection.findOne({
    $or: [{ id: new BSON.UUID(id) }, { email: email }, { empId: empId }],
  });

  function convertRecord(
    insertedRecord: unknown,
    newUserId?: BSON.UUID,
    newUserEmail?: string
  ) {
    const data = insertedRecord as WithId<InsertedRecord>
    if (data?.email) {
      return {
        id: data?.id?.toString(),
        email: data?.email,
        name: getNameFromEmail(data?.email),
        success: true
      };
    }
    const insertedData = insertedRecord as InsertOneResult<InsertedRecord>
    if (!insertedData) throw new Error('Error inserting new user data')
    return {
      id: newUserId?.toString(),
      email: newUserEmail,
      name: getNameFromEmail(newUserEmail),
      success: true
    };
  }

  if (!userExist) {
    const newUserId = new UUID();
    const data = await connection.insertOne({
      email,
      empId,
      id: newUserId,
      orderDetails: [
        {
          ...orderDetails,
        },
      ],
    });
    return convertRecord(data, newUserId, email);
  } else {
    if (id) {
      const idExists = await connection?.findOne({ id: new BSON.UUID(id) });
      if (!idExists) {
        throw new Error("No user found with this id");
      } else {
        const data = await connection?.findOneAndUpdate(
          { id: new BSON.UUID(id) },
          {
            $addToSet: { orderDetails },
          },
          { returnDocument: "after" }
        );
        if (!data) throw new Error("Unable to find and update record");
        return convertRecord(data as unknown);
      }
    } else {
      if (orderDetails) {
        const data = await connection?.findOneAndUpdate(
          {
            $or: [{ email }, { empId }],
          },
          {
            $set: {
              email,
              empId,
            },
            $addToSet: { orderDetails },
          },
          {
            upsert: false,
            returnDocument: "after",
          }
        );
        return convertRecord(data);
      }
    }
  }
}

export async function EditOrder(params: EditOrderPayload) {
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");

  const userExist = await connection.updateOne(
    { id: new BSON.UUID(params?.userId), 'orderDetails.id': new BSON.UUID(params?.orderId) },
    { $set: { "orderDetails.$.item": params?.newItemKey } }
  );
  return {
    ...userExist,
    success: userExist?.modifiedCount === 1 && userExist?.matchedCount === 1,
    closeEditOrderItemModal: userExist?.modifiedCount === 1 && userExist?.matchedCount === 1
  }
}

export async function GetUserOrderDetails(params: GetOrderPayload) {
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");
  const orders = await connection?.findOne({
    id: new BSON.UUID(params?.id)
  })
  return orders;
}

export async function GetTodaysOrder() {
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  const orders = await connection.aggregate([
    { $unwind: "$orderDetails" },
    {
      $addFields: {
        parsedOrderDate: { $dateFromString: { dateString: "$orderDetails.orderDate" } },
      },
    },
    {
      $match: {
        parsedOrderDate: {
          $gte: startOfDay,
          // $gte: new Date('2025-01-28T07:41:06.155Z'),
          $lte: endOfDay,
        },
      },
    },
  ]).toArray();
  return orders;
}

export async function DeleteOrderByItem(id: string, deleteItemId: string) {
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");
  const userData = await connection.findOne({ id: new BSON.UUID(id) })
  if (!userData) throw new Error('Invalid user');
  if(!userData?.orderDetails || userData?.orderDetails?.length < 1) return { success: false};
  const filter: Filter<Document> = {
    id: new BSON.UUID(id),
  };
  const update: UpdateFilter<{ orderDetails: { id?: BSON.UUID }[] }> = {
    $pull: {
      orderDetails: { id: new BSON.UUID(deleteItemId) },
    }
  };
  const deleteData = await connection.updateOne(
   filter, update as Document[]
  );
  return { success: !!deleteData?.modifiedCount };
}

export async function CheckForRepeatOrder(id: string) {
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");
  const userData = await connection.findOne({ id: new BSON.UUID(id) })
  if (!userData) throw new Error('Invalid user');
  if(!userData?.orderDetails || userData?.orderDetails?.length < 1) return false;
  return userData.orderDetails.sort((a: OrderDetailsResponse, b: OrderDetailsResponse) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0].item
}

export async function RepeatOrderByUserId(id: string, drinkDetails: DrinkDetails) {
  const connection = await Connection().then((e: unknown) => {
    const schema = e as MongoClient;
    return schema.db("sample_mflix").collection("TestNew");
  });
  if (!connection) throw new Error("connection illadeyyyyy");
  // Update the user's record by pushing the new order to orderDetails
  const result = await connection.updateOne(
    { id: new BSON.UUID(id) }, // Find the record by id
    {
      $push: {
        orderDetails: {
          item: drinkDetails?.name as string,
          price: drinkDetails?.price as number,
          orderDate: new Date().toISOString(), // Automatically add the current date
          id: new UUID()
        },
      } as PushOperator<{
        orderDetails: {
          item: string, price: number, orderDate: string, id: BSON.UUID
        }[]
      }>,
    }
  );

  console.log(
    result.modifiedCount > 0
      ? "Order added successfully."
      : "No matching user found."
  );

  return result.modifiedCount > 0
}
