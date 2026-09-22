export const THEME_CHANGE_EVENT = "go-bs-theme-change";

/** Flips the `dark` class on <html>, persists it, and notifies listeners. */
export function toggleTheme() {
  const next = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", next);
  localStorage.setItem("theme", next ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
