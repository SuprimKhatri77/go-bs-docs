// Client-side loader for the go-bs WebAssembly build (wasm/main.go, compiled
// via scripts/build-wasm.sh into public/converter.wasm + public/wasm_exec.js).
// This runs the *real* go-bs library, compiled to wasm, in the browser.

export interface BSDate {
  year: number;
  month: number;
  day: number;
  string: string;
  weekday?: string;
  monthName?: string;
  monthNameNepali?: string;
}

export interface WasmResult<T> {
  value: T | null;
  error: string | null;
}

export interface MonthCalendarResult {
  weeks: (number | null)[][];
  monthName?: string;
  monthNameNepali?: string;
  daysInMonth?: number;
}

export interface SupportedRange {
  minBSYear: number;
  maxBSYear: number;
}

export interface GoBS {
  adToBS(adDateString: string): WasmResult<BSDate>;
  bsToAD(year: number, month: number, day: number): WasmResult<string>;
  monthCalendar(year: number, month: number): WasmResult<MonthCalendarResult>;
  supportedRange(): SupportedRange;
}

declare global {
  interface Window {
    // Installed by public/wasm_exec.js.
    Go: new () => {
      importObject: WebAssembly.Imports;
      run(instance: WebAssembly.Instance): Promise<void>;
    };
    // Installed by wasm/main.go's js.Global().Set("goBS", ...).
    goBS?: GoBS;
  }
}

let loadPromise: Promise<GoBS> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.body.appendChild(script);
  });
}

/** Loads and starts the go-bs wasm module, caching the in-flight/completed load. */
export function loadGoBS(): Promise<GoBS> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    await loadScript("/wasm_exec.js");
    const go = new window.Go();
    const resp = await fetch("/converter.wasm");
    const { instance } = await WebAssembly.instantiateStreaming(resp, go.importObject);
    // Don't await: main.go blocks forever on select{} to keep goBS callable.
    void go.run(instance);

    // go.run resolves importObject calls synchronously up to the first
    // `select{}`, so goBS is set by the time the microtask queue drains.
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (!window.goBS) {
      throw new Error("go-bs wasm module loaded but did not register goBS");
    }
    return window.goBS;
  })();

  return loadPromise;
}
