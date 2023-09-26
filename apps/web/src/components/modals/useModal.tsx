import { ModalFn } from "@/types/modal";
import { useState, useCallback } from "react";

export const useModal = (
  Modal: ModalFn,
  options?: { defaultOpen?: boolean },
): [
  () => JSX.Element,
  {
    openModal: () => void;
    closeModal: () => void;
    open: boolean;
    setOpen: (value: boolean) => void;
  },
] => {
  const [open, setOpen] = useState(options?.defaultOpen || false);
  const _modal = useCallback(
    () => <Modal open={open} onOpenChange={setOpen} />,
    [Modal, open],
  );
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return [
    _modal,
    {
      openModal,
      closeModal,
      open,
      setOpen,
    },
  ];
};
