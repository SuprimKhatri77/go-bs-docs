"use client";

import { useEffect, useState } from "react";
import { loadGoBS, type GoBS } from "./wasm";

export type GoBSState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; goBS: GoBS };

/** Loads the go-bs wasm module on mount and returns its loading state. */
export function useGoBS(): GoBSState {
  const [state, setState] = useState<GoBSState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadGoBS()
      .then((goBS) => {
        if (!cancelled) setState({ status: "ready", goBS });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
