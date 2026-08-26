import { createContext, useContext } from "react";

export type CursorMode = "default" | "link" | "project" | "material" | "hidden";

export type CursorState = {
  mode: CursorMode;
  label: string;
  setCursor: (mode: CursorMode, label?: string) => void;
};

export const CursorContext = createContext<CursorState | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    return {
      mode: "default" as CursorMode,
      label: "",
      setCursor: () => undefined,
    };
  }
  return ctx;
}
