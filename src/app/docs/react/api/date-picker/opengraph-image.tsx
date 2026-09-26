import { ogImage, ogSize } from "@/lib/og";

export const alt = "NepaliDatePicker — bikram-sambat-react docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/react/api/date-picker");
}
