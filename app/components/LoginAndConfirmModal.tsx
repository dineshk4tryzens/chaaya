import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoginConfirmModalProps } from "~/types/components/loginConfirmModal";

export const LoginAndConfirmModal = ({
  id,
  modalOpen,
  modalClose,
  onSubmit,
  onEmpIdSelected,
  onEmailSelected,
}: LoginConfirmModalProps) => {
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
          { !id &&
            <>
              <DialogContentText>
                Please enter your email address and employee id here.
              </DialogContentText>
              <TextField
                required
                margin="dense"
                id="name"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e) => onEmailSelected(e?.currentTarget?.value)}
              />
              <TextField
                required
                margin="dense"
                id="empId"
                name="empId"
                label="Employee ID"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => onEmpIdSelected(e?.currentTarget?.value)}
              />
            </>
          }
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
                Place your order?
              </DialogContentText>
            </>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={() => onSubmit()}>
            {id ? 'Confirm' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
