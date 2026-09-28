import {
  AlignmentIcon,
  BalancingIcon,
  FittingIcon,
  type IconProps,
} from "@/components/icons";

const ICONS = {
  fitting: FittingIcon,
  alignment: AlignmentIcon,
  balancing: BalancingIcon,
} as const;

/** Renders a service's Studio `icon` key; an unknown or missing key renders nothing. */
export function ServiceIcon({ icon, ...props }: IconProps & { icon: string | null | undefined }) {
  const Icon = icon && Object.hasOwn(ICONS, icon) ? ICONS[icon as keyof typeof ICONS] : null;
  return Icon ? <Icon {...props} /> : null;
}
