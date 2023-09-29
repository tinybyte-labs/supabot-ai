import Color from "color";

export function getHSLFromColor(color: string) {
  try {
    return Color(color)
      .hsl()
      .string()
      .replace("hsl(", "")
      .replaceAll(",", "")
      .replace(")", "");
  } catch (error) {
    return "";
  }
}
