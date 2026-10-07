import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

function isLinkProps(props: ButtonProps | LinkButtonProps): props is LinkButtonProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps | LinkButtonProps) {
  if (isLinkProps(props)) {
    const { href, className = "", children, ...linkProps } = props;
    return (
      <Link href={href} className={`button${className ? ` ${className}` : ""}`} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { className = "", children, ...buttonProps } = props;
  return (
    <button className={`button${className ? ` ${className}` : ""}`} {...buttonProps}>
      {children}
    </button>
  );
}
