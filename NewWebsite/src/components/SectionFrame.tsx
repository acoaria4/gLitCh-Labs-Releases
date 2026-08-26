import type { ReactNode } from "react";
import "./SectionFrame.css";

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
  number?: string;
  label?: string;
};

export function SectionFrame({ id, className = "", children, number, label }: Props) {
  return (
    <section id={id} className={`section-frame ${className}`.trim()}>
      {(number || label) && (
        <div className="section-frame__meta container">
          {number ? <span className="meta">{number}</span> : null}
          {label ? <span className="meta meta--dim">{label}</span> : null}
        </div>
      )}
      <div className="corner-marks" aria-hidden="true">
        <span />
      </div>
      {children}
    </section>
  );
}
