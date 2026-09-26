import { ogImage, ogSize } from "@/lib/og";

export const alt = "Styling & customization — bikram-sambat-react docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/react/guides/styling");
}
