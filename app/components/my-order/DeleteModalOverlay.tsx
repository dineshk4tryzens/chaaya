import { Alert, Box, CircularProgress, Divider, Snackbar, Stack, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { DeleteModalOverlayProps } from "~/types/components/deleteModalOverlayProps";
import DeleteIcon from "../icons/Delete";

export const DeleteModalOverlay = (props?: DeleteModalOverlayProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const deletingStarted = useRef(false)
  useEffect(() => {
    if (props?.deleting?.start === true) {
      deletingStarted.current = true
      return
    }
    if (props?.deleting?.start === false && deletingStarted.current === true) {
      setOpenSnackbar(true)
      deletingStarted.current = false;
    }
  }, [props?.deleting])

  return (
    <div
      className="flex flex-col items-center h-full justify-center mx-12"
      onClick={() => props?.setOpenDeleteModal(false)}
      role="presentation"
    >
      <Box
        component="section"
        className="max-w-screen-sm w-full font-Averta rounded-xl border border-[#CBD5E1] !border-opacity-60 bg-slate-500/80 z-20 dark:!text-[#CBD5E1]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left">
          <Typography variant="h4" className="p-4">
            Delete Your Order
          </Typography>
          <Divider
            variant="fullWidth"
            className="!border-[#CBD5E1] !mb-4 !opacity-80"
          ></Divider>
          <div className="dark:text-white mx-14">
            <div>
              Are you sure you want to delete <Typography variant="overline" className="!font-bold bg-white/70 dark:bg-slate-800">{`\u00A0\u00A0${props?.deleteOrderData?.item}\u00A0\u00A0`}</Typography> which was ordered on
              <br></br>
              <Typography variant="overline" className="!font-bold bg-white/70 dark:bg-slate-800">{`\u00A0\u00A0${props?.deleteOrderData?.orderDate}\u00A0\u00A0`}</Typography>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={()=> {
              if (props?.deleting?.success) props?.setOpenDeleteModal(false)
              setOpenSnackbar(!openSnackbar);
            }}>
              <Alert
                onClose={() => setOpenSnackbar(!openSnackbar)}
                severity={props?.deleting?.success === true ? "success" : "error"}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {props?.deleting?.message}
              </Alert>
            </Snackbar>
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
                  startIcon={props?.deleting?.start !== true ? <DeleteIcon/>: <CircularProgress color={"inherit"} size={30} />}
                  disabled={props?.deleting?.start === true || props?.deleting?.success === true}
                  onClick={() => props?.setSubmitDeleteDrink(true)}
                >
                  Delete
                </Button>
                <Button
                  className="dark:!bg-[#e4dbe954] !text-[#CBD5E1] !border-[#CBD5E1] disabled:!border-0"
                  variant="outlined"
                  onClick={() => props?.setOpenDeleteModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}