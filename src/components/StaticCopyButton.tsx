"use client";

import { CopyButton } from "./CopyButton";

/**
 * Thin client wrapper so server components (like CodeBlock) can pass a
 * plain, serializable `text` prop rather than a function — Server
 * Components can't pass closures across the RSC boundary to Client
 * Components, but this component can, since it's client-side itself.
 */
export function StaticCopyButton({ text }: { text: string }) {
  return <CopyButton getText={() => text} />;
}
