import { ActionFunctionArgs } from "@remix-run/node";
import { DeleteOrder } from "~/data/order";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = formData.get('id') as string;
  const deleteItem = formData.get('deleteItem') as string;
  if (!userId || !deleteItem)
    return {
      status: 500,
      message: "You dont have the required permissions to access this api!",
    };
  const data = await DeleteOrder(userId, deleteItem)
  return data;
}