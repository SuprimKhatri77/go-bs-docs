import { ogImage, ogSize } from "@/lib/og";

export const alt = "SSR & Next.js — bikram-sambat-react docs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("/docs/react/guides/ssr");
}
