import { SetStateAction } from "react";

export interface DeleteModalOverlayProps {
  deleteOrderData?: {
    id?: string;
    item?: string;
    orderDate?: string;
  };
  setOpenDeleteModal: (value: SetStateAction<boolean>) => void;
  setSubmitDeleteDrink: (value: SetStateAction<boolean>) => void;
  deleting: { start?: boolean, success?: boolean, message?: string };
}
