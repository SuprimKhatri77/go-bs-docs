import { ogImage, ogSize } from "@/lib/og";

export const alt = "NepaliCalendar — bikram-sambat-react docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/react/api/calendar");
}
