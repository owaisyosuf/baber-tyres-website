import type { ElementType, ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3;

interface HeadingProps {
  level: HeadingLevel;
  /** Override the rendered tag while keeping the visual size of `level`. */
  as?: ElementType;
  eyebrow?: ReactNode;
  className?: string;
  children: ReactNode;
}

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-h1",
  2: "text-h2",
  3: "text-h3",
};

const levelTags: Record<HeadingLevel, ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
};

export function Heading({ level, as, eyebrow, className, children }: HeadingProps) {
  const Tag = as ?? levelTags[level];
  const heading = (
    <Tag className={[levelClasses[level], className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );

  if (!eyebrow) return heading;

  return (
    <div>
      <p className="mb-2 text-label uppercase text-accent">{eyebrow}</p>
      {heading}
    </div>
  );
}
