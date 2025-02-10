import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  SvgIconProps,
  Typography,
} from "@mui/material";
import { Constants } from "~/data/constants";
import { Drink } from "~/types";
import React, { useEffect, useState } from "react";
import { Form, useNavigate, useSubmit } from "@remix-run/react";
import DeleteIcon from "./icons/Delete";
import { DeleteModalOverlay } from "./my-order/DeleteModalOverlay";

export const ViewOrders = ({
  orders,
  userId,
  closeEditOrderItemModal
}: {
  orders?: { id?: string; item?: string; orderDate?: string }[];
  userId?: string,
  closeEditOrderItemModal?: boolean
}) => {
  // Edit Modal States
  const [editOriginalOrderItem, setEditOriginalOrderItem] = useState("");
  const [editOrderId, setEditOrderId] = useState("");
  const [value, setValue] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  // Delete Modal States
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [submitDeleteDrink, setSubmitDeleteDrink] = useState(false);
  const [deleting, setDeleting] = useState<{
    start?: boolean;
    success?: boolean;
    message?: string;
  }>({ start: false });
  const [deleteOrderData, setDeleteOrderData] = useState<{
    id?: string;
    item?: string;
    orderDate?: string;
}>();
  const submit = useSubmit();
  const navigate = useNavigate();
  const submitEditDrinkSelection = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!userId) throw new Error('');
    const formData = new FormData();
    formData.append("editDrink", "true");
    formData.append("userId", userId);
    formData.append("updateDrinkDetails", JSON.stringify({
      orderId: editOrderId,
      orderValue: value
    }));
    submit(formData, {
      method: "post",
      encType: "application/x-www-form-urlencoded",
    });
    // if (!selectedDrinkData) {
    //   return setOpenSnackbar(true);
    // }
    // return setModalOpen(true);
  };

  useEffect(() => {
    if (closeEditOrderItemModal) setOpenEditModal(false)
  }, [closeEditOrderItemModal])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId || !deleteOrderData?.id) throw new Error('Missing data to delete order');
        const body = new FormData();
        body.append('id', userId)
        body.append('deleteItem', deleteOrderData?.id)
        const response = await fetch("/api/deleteOrder", {
          method: 'post',
          body,
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        if (result?.success) {
          setSubmitDeleteDrink(false);
          setDeleting({ start: false, success: true, message: 'Item deleted successfully' });
          // setOpenDeleteModal(false);
          return true;
        } else throw new Error('Invalid request')
      } catch (err) {
        setSubmitDeleteDrink(false);
        setDeleting({ start: false, success: false, message: 'Unable to delete item' });
        return false;
      }
    };
    if (submitDeleteDrink) {
      setDeleting({ start: true });
      if (!userId || !deleteOrderData?.id) throw new Error('Missing data to delete order');
      fetchData().then((data) => data).catch((data) => data)
    }
  }, [deleteOrderData?.id, submitDeleteDrink, userId])

  useEffect(() => {
    if (deleting?.success && !openDeleteModal) {
      navigate(0)
    }
  }, [openDeleteModal, deleting?.success, deleting, navigate])

  function EditIcon(props: SvgIconProps) {
    return (
      <SvgIcon
        {...props}
        className="!w-[35px] !h-full max-h-[35px] p-1.5 mx-auto hover:bg-[#5154624a] rounded-full cursor-pointer dark:text-slate-300"
      >
        <path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
      </SvgIcon>
    );
  }

  const EditModalOverlay = () => (
    <div
      className="flex flex-col items-center h-full justify-center mx-12"
      onClick={() => setOpenEditModal(false)}
      role="presentation"
    >
      <Box
        component="section"
        className="max-w-screen-sm w-full font-Averta rounded-xl border border-[#CBD5E1] !border-opacity-60 bg-white/10 z-20 dark:!text-[#CBD5E1]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left">
          <Typography variant="h4" className="p-4">
            Edit Your Order
          </Typography>
          <Divider
            variant="fullWidth"
            className="!border-[#CBD5E1] !mb-4 !opacity-80"
          ></Divider>
          <div className="dark:text-white mx-14">
            <Form method="post">
              <FormControl fullWidth>
                <InputLabel
                  id="drink-select-label"
                  sx={{ color: "#CBD5E1 !important" }}
                >
                  Drink
                </InputLabel>
                <Select
                  labelId="drink-select-label"
                  id="drink-select"
                  value={value}
                  label="Age"
                  className="!max-h-96"
                  sx={{
                    maxHeight: "400px !important",
                    color: "#CBD5E1 !important",
                    "& .MuiSvgIcon-root": { color: "#CBD5E1 !important" },
                    ".MuiSelect-outlined": {
                      color: "#CBD5E1 !important",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(228, 219, 233, 0.25)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(228, 219, 233, 0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(228, 219, 233, 0.25)",
                    },
                  }}
                  MenuProps={{
                    sx: {
                      maxHeight: "400px !important",
                    },
                  }}
                  onChange={(e) => {
                    setValue(e?.target?.value);
                  }}
                >
                  {Object.keys(Constants.Drinks).map((drink, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={Constants.Drinks[drink as Drink]?.label}
                        className="dark:text-[#CBD5E1]"
                        style={{ maxHeight: 400 }}
                      >
                        {Constants.Drinks[drink as Drink]?.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <div className="justify-items-end my-3">
                <Stack direction="row" spacing={2}>
                  <Button
                    sx={{
                      ".Mui-disabled": {
                        backgroundColor: "#e4dbe954 !important",
                      },
                    }}
                    className="dark:!bg-[#e4dbe954] !text-[#CBD5E1] !border-[#CBD5E1] disabled:!border-0"
                    variant="outlined"
                    disabled={editOriginalOrderItem === value}
                    onClick={(e) => submitEditDrinkSelection(e)}
                  >
                    Save
                  </Button>
                  <Button
                    className="dark:!bg-[#e4dbe954] !text-[#CBD5E1] !border-[#CBD5E1] disabled:!border-0"
                    variant="outlined"
                    onClick={() => setOpenEditModal(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </div>
            </Form>
          </div>
        </div>
      </Box>
    </div>
  );

  const editOrderLi = (id?: string, item?: string) => {
    setEditOrderId(id || "");
    setEditOriginalOrderItem(item || "");
    setValue(item || "");
    return setOpenEditModal(true);
  };

  const deleteOrderLi = (data: {
    id?: string
    item?: string;
    orderDate?: string;
  }) => {
    setDeleteOrderData(data);
    return setOpenDeleteModal(true);
  };

  return (
    <div className="relative z-10">
      <div className="flex w-full mx-auto my-10 max-w-screen-xl bg-opacity-80 justify-around gap-7 dark:text-slate-300">
        <div className="flex w-full my-5 max-w-screen-xl relative z-20 dark:text-slate-300">
          <div className="text-sm leading-6 w-full">
            <figure className="relative flex flex-col-reverse shadow-md backdrop-saturate-150 bg-opacity-80 backdrop-blur-md bg-white/10 z-20 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
              <figcaption className="flex items-center space-x-4 flex-1 flex-wrap justify-center">
                <div className="flex-auto justify-center">
                  <Typography
                    variant="h4"
                    className="text-base text-slate-900 font-semibold dark:text-slate-200"
                  >
                    Your Orders
                  </Typography>
                  <Divider
                    variant="fullWidth"
                    className="bg-slate-700 !mt-3 !mb-5"
                  ></Divider>
                  <div className="flex h-[500px] overflow-auto max-sm:text-xs">
                    <table className="border-collapse w-full text-left">
                      <tbody>
                        <tr className="!mb-3 sticky top-0 shadow-md backdrop-saturate-200 backdrop-blur-xl bg-neutral-200 z-20 dark:bg-slate-800">
                          <th className="font-bold uppercase">Item</th>
                          <th className="font-bold uppercase">Order Date</th>
                          <th className="font-bold uppercase text-center">
                            Action
                          </th>
                        </tr>
                        {orders?.map((data, index) => (
                          <>
                            <tr key={index} className="!leading-9 h-8">
                              <td>{data?.item}</td>
                              <td>{data?.orderDate}</td>
                              <td className="!text-center">
                                <EditIcon
                                  onClick={() =>
                                    editOrderLi(data?.id, data?.item)
                                  }
                                ></EditIcon>
                                <DeleteIcon onClick={() => deleteOrderLi(data)}/>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </figcaption>
            </figure>
            {openEditModal && (
              <>
                <div className="fixed w-full h-full left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] z-50">
                  <EditModalOverlay/>
                </div>
              </>
            )}
            {openDeleteModal && (
              <>
                <div className="fixed w-full h-full left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-50 shadow-md backdrop-saturate-150 bg-opacity-80 backdrop-blur-md bg-white/10 dark:bg-slate-800 dark:highlight-white/5">
                  <DeleteModalOverlay
                    deleteOrderData={deleteOrderData}
                    setOpenDeleteModal={setOpenDeleteModal}
                    setSubmitDeleteDrink={setSubmitDeleteDrink}
                    deleting={deleting}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
