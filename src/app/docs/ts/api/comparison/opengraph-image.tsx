import { ogImage, ogSize } from "@/lib/og";

export const alt = "Comparison — bikram-sambat-ts docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/ts/api/comparison");
}
