import { SketchPicker } from "react-color";

const ColorPicker = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <SketchPicker color={value} onChange={(color) => onChange?.(color.hex)} />
  );
};

export default ColorPicker;
