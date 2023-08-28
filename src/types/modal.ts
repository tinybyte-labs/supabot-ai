import { FunctionComponent } from "react";

export type ModalFn = FunctionComponent<{
  open: boolean;
  onOpenChange: (value: boolean) => void;
}>;
