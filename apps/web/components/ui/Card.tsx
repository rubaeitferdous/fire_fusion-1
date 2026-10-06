import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  muted?: boolean;
  as?: "section" | "article" | "div";
};

export function Card({
  as: Element = "section",
  className = "",
  muted = false,
  ...props
}: CardProps) {
  return (
    <Element
      className={`card${muted ? " card-muted" : ""}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
