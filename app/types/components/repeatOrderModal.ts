export interface RepeatOrderModalProps {
  modalOpen: boolean;
  label?: string;
  modalClose: (params?: boolean) => void;
  onSubmit: () => void;
  onEmpIdSelected: (email: string) => void;
  onEmailSelected: (email: string) => void;
  id?: string;
}
