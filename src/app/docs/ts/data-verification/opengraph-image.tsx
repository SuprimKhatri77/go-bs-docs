import { ogImage, ogSize } from "@/lib/og";

export const alt = "Calendar data: sources & verification — bikram-sambat-ts docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/ts/data-verification");
}
