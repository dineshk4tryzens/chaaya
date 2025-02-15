export interface updateUPIIdModalProps {
  modalOpen: boolean;
  modalClose: (params?: boolean) => void;
  onSubmit: () => void;
  onUpiIdSelected: (upiId: string) => void;
  id?: string;
}
