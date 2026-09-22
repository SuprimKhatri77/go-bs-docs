import { ogImage, ogSize } from "@/lib/og";

export const alt = "Errors — go-bs docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/api/errors");
}
