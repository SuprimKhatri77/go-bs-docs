import { ogImage, ogSize } from "@/lib/og";

export const alt = "Calendar-grid helpers — bikram-sambat-ts docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/ts/api/calendar-grid");
}
