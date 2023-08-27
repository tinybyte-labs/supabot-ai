import { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { searchParams } = new URL(req.url || "");
  const size = Number(searchParams.get("size")) || 144;
  const bgColor = searchParams.get("bgColor") || "#2563EB";
  const fgColor = searchParams.get("bgColor") || "#FFFFFF";
  const initials = searchParams.get("initials") || "?";
  const chars = initials
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((i) => i[0])
    .join("");

  return new ImageResponse(
    (
      <div
        tw="flex items-center justify-center w-full h-full"
        style={{
          backgroundColor: bgColor,
          fontSize: size / 2.5,
          color: fgColor,
        }}
      >
        {chars.toUpperCase()}
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
