import { ogImage, ogSize } from "@/lib/og";

export const alt = "Getting started — bikram-sambat-ts docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/ts/getting-started");
}
