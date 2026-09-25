import type { ElementType, ReactNode } from "react";

/** Max width 1280px, gutters never below 16px at any width — design.md §7.3. */
interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag
      className={["mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
