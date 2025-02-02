import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { RepeatOrderModalProps } from "~/types/components/repeatOrderModal";

export const RepeatOrderModal = ({
  id,
  label,
  modalOpen,
  modalClose,
  onSubmit,
}: RepeatOrderModalProps) => {
  const [open, setOpen] = useState<boolean>();
  useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);

  const handleClose = () => {
    setOpen(false);
    modalClose(false);
  };

  return (
    <>
      <Dialog
        open={open || false}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        {id ? <DialogTitle>Confirm</DialogTitle> : <DialogTitle>Register and Create Order</DialogTitle>}
        <DialogContent className="min-w-96">
          { id &&
            <>
              <input
                required
                id="id"
                name="id"
                type="hidden"
                value={id ?? undefined}
              />
              <DialogContentText>
                Would you like to reorder {label}.
              </DialogContentText>
            </>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={() => onSubmit()}>
            {id ? 'Re-Order' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
