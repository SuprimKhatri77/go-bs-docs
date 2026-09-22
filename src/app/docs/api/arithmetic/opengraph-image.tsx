import { ogImage, ogSize } from "@/lib/og";

export const alt = "Arithmetic & ranges — go-bs docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/api/arithmetic");
}
