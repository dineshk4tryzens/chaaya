import { DrinkDetails } from "./drink";

export interface CreateOrderPayload {
  id?: string;
  drinkDetails?: DrinkDetails;
  email?: string;
  empId?: string;
  orderDetails?: OrderDetails;
}

export interface EditOrderPayload {
  userId?: string;
  orderId?: string;
  orderValue?: string;
  newItemKey?: string;
}

export interface OrderDetails {
  orderDate: string;
  item: string;
  price: number;
}

export interface OrderDetailsResponse {
  id: string;
  orderDate: string;
  item: string;
  price: number;
}

export interface GetOrderPayload {
  id: string;
}

export interface InsertedRecord {
  _id: string;
  email: string;
  empId: string;
  id: string;
  orderDetails: OrderDetails[];
  // _id: new ObjectId('676aeb0e7bc20941cd4c28ad'),
  // email: 'jayara.j@tryzens.com',
  // empId: '111',
  // id: new UUID('3c9cda5a-7dee-407d-9bbc-eef1247af738'),
  // orderDetails: [
  //   { item: 'TeaWO', orderDate: '2024-12-24T17:10:38.283Z', price: 10 },
  //   {
  //     item: 'Coffee',
  //     orderDate: '2024-12-24T17:11:56.839Z',
  //     price: 10
  //   },
  //   { item: 'Tea', orderDate: '2024-12-24T17:18:29.454Z', price: 10 }
  // ]
}

export interface ConsilatedDrinkFormat {
  key: string;
  label: string;
  price: number;
  count: number;
  emails: string[];
}

export interface ResultOrderInWords {
  label: string;
}

export interface GetTodaysConsolidatedOrderResult {
  commonDrinks: ConsilatedDrinkFormat[];
  uniqueDrinks: ConsilatedDrinkFormat[];
  resultOrderInWords: ResultOrderInWords[];
}
