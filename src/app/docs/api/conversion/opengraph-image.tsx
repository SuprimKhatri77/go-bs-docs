import { ogImage, ogSize } from "@/lib/og";

export const alt = "Conversion — go-bs docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/api/conversion");
}
