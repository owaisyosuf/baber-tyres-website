import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonVariant = "primary" | "whatsapp" | "secondary" | "ghost";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const baseClasses =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-5 text-body font-semibold " +
  "transition-[box-shadow,color,border-color,background-color,filter,scale] duration-150 ease-out-soft hover:scale-[1.02] motion-reduce:hover:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:brightness-105 hover:shadow-glow-strong",
  whatsapp: "bg-accent text-background hover:brightness-105 hover:shadow-glow-strong",
  secondary:
    "bg-transparent text-text border border-border-strong hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-muted hover:text-accent",
};

function buttonClassName(
  variant: ButtonVariant,
  fullWidth: boolean | undefined,
  className: string | undefined,
) {
  return [baseClasses, variantClasses[variant], fullWidth ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
}

function ButtonContent({
  icon,
  iconPosition,
  children,
}: {
  icon: ReactNode;
  iconPosition: "left" | "right";
  children: ReactNode;
}) {
  if (!icon) return <>{children}</>;
  const iconNode = (
    <span aria-hidden className="shrink-0 [&>svg]:h-5 [&>svg]:w-5">
      {icon}
    </span>
  );
  return iconPosition === "right" ? (
    <>
      <span>{children}</span>
      {iconNode}
    </>
  ) : (
    <>
      {iconNode}
      <span>{children}</span>
    </>
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    icon,
    iconPosition = "left",
    fullWidth,
    className,
    children,
  } = props;
  const cls = buttonClassName(variant, fullWidth, className);
  const content = (
    <ButtonContent icon={icon} iconPosition={iconPosition}>
      {children}
    </ButtonContent>
  );

  if (props.href !== undefined) {
    const { href, onClick } = props;
    const ariaLabel = props["aria-label"];
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const isExternal = /^https?:\/\//.test(href);

    if (isInternal) {
      return (
        <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  const { type = "button", onClick, disabled } = props;
  const ariaLabel = props["aria-label"];
  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
