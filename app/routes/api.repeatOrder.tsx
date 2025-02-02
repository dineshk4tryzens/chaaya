import { LoaderFunctionArgs } from "@remix-run/node";
import { CheckIfRepeatOrderExists } from "~/data/order";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request?.url);
  const userId = url?.searchParams?.get("id");
  if (!userId)
    return {
      status: 500,
      message: "You dont have the required permissions to access this api!",
    };
  const data = await CheckIfRepeatOrderExists(userId)
  return data;
}