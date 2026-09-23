import { ogImage, ogSize } from "@/lib/og";

export const alt = "Arithmetic & ranges — bikram-sambat-ts docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/ts/api/arithmetic");
}
