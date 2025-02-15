import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { updateUPIIdModalProps } from "~/types/components/updateUPIIdModal";

export const UpdateUpiIdModal = ({
  id,
  modalOpen,
  modalClose,
  onUpiIdSelected,
  onSubmit,
}: updateUPIIdModalProps) => {
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
      <DialogTitle>Update UPI ID</DialogTitle>
        <DialogContent className="min-w-96">
            <>
              <input
                required
                id="id"
                name="id"
                type="hidden"
                value={id ?? undefined}
              />
              <DialogContentText>Please update your UPI Id</DialogContentText>
              <TextField
                required
                margin="dense"
                id="upiId"
                name="upiId"
                label="UPI ID"
                type="text"
                fullWidth
                variant="standard"
                helperText="പൈസ വേണമെങ്കിൽ മതി"
                onChange={(e) => onUpiIdSelected(e?.currentTarget?.value)}
              />
            </>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Skip, I&apos;ll do this later</Button>
          <Button type="submit" onClick={() => onSubmit()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
