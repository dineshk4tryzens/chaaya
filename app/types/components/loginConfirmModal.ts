export interface LoginConfirmModalProps {
  modalOpen: boolean;
  modalClose: (params?: boolean) => void;
  onSubmit: () => void;
  onEmpIdSelected: (email: string) => void;
  onEmailSelected: (email: string) => void;
  id?: string;
}
