import { ogImage, ogSize } from "@/lib/og";

export const alt = "Date, parsing & validation — go-bs docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/api/date");
}
