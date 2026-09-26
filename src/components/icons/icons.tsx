import { svgProps, type IconProps } from "./Icon";

/* Contact & utility ---------------------------------------------------- */

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect x="3" y="4" width="18" height="13" rx="3" />
      <path d="M8 21l3.5-4" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 4h4l1 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 1v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/* Vehicle categories ----------------------------------------------------- */

export function CarIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 16.5V12a2 2 0 0 1 .4-1.2L7 8.5a2 2 0 0 1 1.6-.8h6.8a2 2 0 0 1 1.6.8l1.6 2.3c.26.35.4.78.4 1.2v4.5" />
      <path d="M3.5 16.5h17" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  );
}

export function SuvIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 17v-4.5l1.2-3.8A2 2 0 0 1 7.1 7.3h9.8a2 2 0 0 1 1.9 1.4L20 12.5V17" />
      <path d="M4 9.8h16" />
      <path d="M2.5 17h19" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect x="1.5" y="9" width="11" height="7" rx="1" />
      <path d="M12.5 12h4l3 3v1" />
      <path d="M1.5 16h1M19.5 16h1" />
      <circle cx="6" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

export function ForkliftIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 4v15" />
      <path d="M5 12h4M5 15h4" />
      <rect x="9" y="10" width="6" height="6" />
      <circle cx="18" cy="19" r="1.5" />
      <path d="M15 19h3" />
    </svg>
  );
}

export function OffRoadIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M3 18l5-8 4 5 3-4 6 7" />
      <path d="M3 18h18" />
    </svg>
  );
}

/* Services ----------------------------------------------------------------- */

export function FittingIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="11" cy="13" r="7" />
      <circle cx="11" cy="13" r="2.5" />
      <path d="M16.5 7.5l3-3a2.1 2.1 0 0 1 3 3l-3 3" />
      <path d="M18 9l2 2" />
    </svg>
  );
}

export function AlignmentIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    </svg>
  );
}

export function BalancingIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 3v18" />
      <path d="M5 8h14" />
      <path d="M5 8l-2 5a3 3 0 0 0 6 0l-2-5" />
      <path d="M19 8l-2 5a3 3 0 0 0 6 0l-2-5" />
    </svg>
  );
}

/* UI ------------------------------------------------------------------------- */

export function FilterIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 4h16l-6 8v6l-4 2v-8z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

type ChevronDirection = "up" | "down" | "left" | "right";

const chevronRotation: Record<ChevronDirection, number> = {
  down: 0,
  up: 180,
  left: 90,
  right: -90,
};

export function ChevronIcon({
  direction = "down",
  style,
  ...props
}: IconProps & { direction?: ChevronDirection }) {
  return (
    <svg
      {...svgProps(props)}
      style={{ transform: `rotate(${chevronRotation[direction]}deg)`, ...style }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
