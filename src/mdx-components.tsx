import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Pre } from "@/components/Pre";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", ...props }) => {
      const internal = href.startsWith("/") || href.startsWith("#");
      if (internal) {
        return <Link href={href} {...props} />;
      }
      return <a href={href} target="_blank" rel="noreferrer" {...props} />;
    },
    pre: Pre,
    ...components,
  };
}
