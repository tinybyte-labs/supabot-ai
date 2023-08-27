import { FunctionComponent } from "react";

export type ModalFn = FunctionComponent<{
  open: boolean;
  onOpenChage: (value: boolean) => void;
}>;
