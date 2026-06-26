import { Fragment, ReactNode } from "react";

/** Renders **token** as emphasised <strong>; everything else as plain text. */
export default function Rich({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={i}
              className="box-decoration-clone rounded bg-accent/[0.18] px-1.5 py-0.5 font-semibold text-text ring-1 ring-inset ring-accent/30 [text-shadow:0_1px_8px_rgba(6,11,20,0.7)]"
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
