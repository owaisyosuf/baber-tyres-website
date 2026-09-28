import {
  CarIcon,
  ForkliftIcon,
  OffRoadIcon,
  SuvIcon,
  TruckIcon,
  type IconProps,
} from "@/components/icons";

const ICONS = {
  car: CarIcon,
  suv: SuvIcon,
  truck: TruckIcon,
  forklift: ForkliftIcon,
  offroad: OffRoadIcon,
} as const;

/** Renders a category's Studio `icon` key; an unknown or missing key renders nothing. */
export function CategoryIcon({ icon, ...props }: IconProps & { icon: string | null | undefined }) {
  const Icon = icon && Object.hasOwn(ICONS, icon) ? ICONS[icon as keyof typeof ICONS] : null;
  return Icon ? <Icon {...props} /> : null;
}
