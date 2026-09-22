import { ogImage, ogSize } from "@/lib/og";

export const alt = "Sources & verification — go-bs docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/data-verification");
}
