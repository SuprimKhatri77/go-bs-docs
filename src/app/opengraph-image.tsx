import { ogImage, ogSize } from "@/lib/og";
import { SITE_TITLE } from "@/lib/site";

export const alt = SITE_TITLE;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage();
}
