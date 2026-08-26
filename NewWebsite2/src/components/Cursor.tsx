import type { CursorMode } from "../hooks/useCursor";
import "./Cursor.css";

type Props = {
  enabled: boolean;
  mode: CursorMode;
  label: string;
};

export function Cursor({ enabled, mode, label }: Props) {
  if (!enabled) return null;

  return (
    <div
      className={`cursor cursor--${mode}`}
      aria-hidden="true"
      style={{ transform: "translate3d(var(--cx), var(--cy), 0)" }}
    >
      <span className="cursor__point" />
      <span className="cursor__ring" />
      {label ? <span className="cursor__label">{label}</span> : null}
    </div>
  );
}
