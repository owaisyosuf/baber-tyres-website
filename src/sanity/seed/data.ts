/**
 * T011 seed content. Everything here is either a confirmed business fact
 * (requirements.md §2) or clearly marked as sample data.
 *
 * Confirmed and seeded as published documents: site settings, the five
 * categories, the three services, and the seven brands whose relationship is
 * known. The remaining brands of the "20+" are OQ-2 — the owner hasn't given
 * the list, so none are invented here; they get added through Studio.
 *
 * Sample products are the exception: their prices and sizes are invented
 * (Constitution §II.6 — "no prices that do not match the shop"), so they are
 * seeded only as `drafts.` documents. The live site queries the published
 * perspective and never sees them; the owner can open, correct, and publish
 * them in Studio. They carry no images (none exist — NFR-12), so Studio will
 * flag each one until an image and alt text are added.
 */
import { siteConfig } from "../../lib/site";

export interface SeedDoc {
  _id: string;
  _type: string;
  [key: string]: unknown;
}

const slug = (current: string) => ({ _type: "slug", current });
const ref = (_ref: string) => ({ _type: "reference", _ref });

export const siteSettingsDoc: SeedDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  shopName: siteConfig.shopName,
  addressLine: siteConfig.addressLine,
  city: siteConfig.city,
  phone: siteConfig.phoneE164,
  whatsapp: siteConfig.whatsappE164,
  hoursOpen: siteConfig.hours.open,
  hoursClose: siteConfig.hours.close,
  openDays: [...siteConfig.hours.openDays],
  closedDay: siteConfig.hours.closedDay,
  deliveryNote: siteConfig.deliveryNote,
  defaultSeo: {
    title: `${siteConfig.shopName} — Tyre Importer & Dealer in ${siteConfig.city}`,
    description:
      "Importer and dealer of 20+ tyre brands on M.A. Jinnah Road, Karachi. Car, SUV, truck, forklift and off-road tyres, plus fitting, computerized alignment and balancing.",
  },
};

export const categoryDocs: SeedDoc[] = [
  {
    _id: "category-car",
    _type: "category",
    name: "Car",
    slug: slug("car"),
    icon: "car",
    displayOrder: 1,
    description:
      "Tyres for cars — hatchbacks, sedans and family cars — from the brands we import and deal in. Find your size or message us on WhatsApp and we will help you match it.",
  },
  {
    _id: "category-suv",
    _type: "category",
    name: "SUV / 4x4",
    slug: slug("suv"),
    icon: "suv",
    displayOrder: 2,
    description:
      "Tyres for SUVs and 4x4s. Find your size or message us on WhatsApp and we will help you match it.",
  },
  {
    _id: "category-truck",
    _type: "category",
    name: "Truck / Commercial",
    slug: slug("truck"),
    icon: "truck",
    displayOrder: 3,
    description:
      "Tyres for trucks and commercial vehicles. Message us on WhatsApp with your size and we will confirm availability.",
  },
  {
    _id: "category-lifter",
    _type: "category",
    name: "Lifter / Forklift",
    slug: slug("lifter"),
    icon: "forklift",
    displayOrder: 4,
    description:
      "Tyres for forklifts and lifters. Message us on WhatsApp with your size and we will confirm availability.",
  },
  {
    _id: "category-offroad",
    _type: "category",
    name: "Off-road",
    slug: slug("offroad"),
    icon: "offroad",
    displayOrder: 5,
    description:
      "Tyres for off-road use. Message us on WhatsApp with your size and we will confirm availability.",
  },
];

/** FR-C1: exactly these three — no puncture repair, no nitrogen inflation. */
export const serviceDocs: SeedDoc[] = [
  {
    _id: "service-tyre-fitting",
    _type: "service",
    name: "Tyre Fitting",
    slug: slug("tyre-fitting"),
    icon: "fitting",
    displayOrder: 1,
    description:
      "Tyre fitting at our M.A. Jinnah Road shop in Karachi. Message us on WhatsApp to confirm timing.",
  },
  {
    _id: "service-wheel-alignment",
    _type: "service",
    name: "Computerized Wheel Alignment",
    slug: slug("wheel-alignment"),
    icon: "alignment",
    displayOrder: 2,
    description:
      "Computerized wheel alignment to keep your vehicle tracking straight and your tyres wearing evenly.",
  },
  {
    _id: "service-wheel-balancing",
    _type: "service",
    name: "Computerized Wheel Balancing",
    slug: slug("wheel-balancing"),
    icon: "balancing",
    displayOrder: 3,
    description:
      "Computerized wheel balancing to reduce vibration and uneven tyre wear.",
  },
];

const brand = (
  name: string,
  id: string,
  relationship: "importer" | "dealer",
  displayOrder: number,
): SeedDoc => ({
  _id: `brand-${id}`,
  _type: "brand",
  name,
  slug: slug(id),
  relationship,
  displayOrder,
});

export const brandDocs: SeedDoc[] = [
  brand("Yokohama", "yokohama", "importer", 1),
  brand("Rapid", "rapid", "importer", 2),
  brand("Michelin", "michelin", "importer", 3),
  brand("Duhow", "duhow", "importer", 4),
  brand("Dunlop", "dunlop", "dealer", 1),
  brand("General", "general", "dealer", 2),
  brand("Armstrong", "armstrong", "dealer", 3),
];

const SAMPLE_NOTE =
  "Sample product — the price and size are placeholders. Replace them with real details and add an image before publishing.";

const sampleProduct = (
  id: string,
  brandName: string,
  brandId: string,
  categoryId: string,
  size: {
    width: number;
    profile: number;
    rim: number;
    sizeLabelOverride?: string;
  },
  label: string,
  price: number,
  extra: { featured?: boolean; inStock?: boolean } = {},
): SeedDoc => ({
  _id: `drafts.product-sample-${id}`,
  _type: "product",
  name: `[SAMPLE] ${brandName} ${label}`,
  slug: slug(`sample-${id}`),
  brand: ref(`brand-${brandId}`),
  category: ref(`category-${categoryId}`),
  ...size,
  price,
  inStock: extra.inStock ?? true,
  featured: extra.featured ?? false,
  description: SAMPLE_NOTE,
});

/**
 * At least one per category. Commercial sizes carry `sizeLabelOverride` and a
 * metric-equivalent triple so they still filter (design.md §5.3): 11R22.5 is
 * commonly cross-referenced to 295/80 R22.5; 7.00-12 is a bias-ply size, so
 * its width is the 7.00in section width in mm with a nominal 100 aspect.
 */
export const sampleProductDocs: SeedDoc[] = [
  sampleProduct(
    "yokohama-185-65-r15",
    "Yokohama",
    "yokohama",
    "car",
    { width: 185, profile: 65, rim: 15 },
    "185/65 R15",
    16500,
    { featured: true },
  ),
  sampleProduct(
    "dunlop-195-65-r15",
    "Dunlop",
    "dunlop",
    "car",
    { width: 195, profile: 65, rim: 15 },
    "195/65 R15",
    18500,
  ),
  sampleProduct(
    "general-265-65-r17",
    "General",
    "general",
    "suv",
    { width: 265, profile: 65, rim: 17 },
    "265/65 R17",
    38500,
    { featured: true },
  ),
  sampleProduct(
    "michelin-235-60-r18",
    "Michelin",
    "michelin",
    "suv",
    { width: 235, profile: 60, rim: 18 },
    "235/60 R18",
    52000,
    { inStock: false },
  ),
  sampleProduct(
    "rapid-11r22-5",
    "Rapid",
    "rapid",
    "truck",
    { width: 295, profile: 80, rim: 22.5, sizeLabelOverride: "11R22.5" },
    "11R22.5",
    68000,
    { featured: true },
  ),
  sampleProduct(
    "armstrong-7-00-12",
    "Armstrong",
    "armstrong",
    "lifter",
    { width: 178, profile: 100, rim: 12, sizeLabelOverride: "7.00-12" },
    "7.00-12",
    21000,
  ),
  sampleProduct(
    "duhow-265-70-r16",
    "Duhow",
    "duhow",
    "offroad",
    { width: 265, profile: 70, rim: 16 },
    "265/70 R16",
    34000,
  ),
];

/** Documents that go live: confirmed business facts only. */
export const publishedDocs: SeedDoc[] = [
  siteSettingsDoc,
  ...categoryDocs,
  ...serviceDocs,
  ...brandDocs,
];

/** Everything the seed script creates, in dependency order. */
export const allSeedDocs: SeedDoc[] = [...publishedDocs, ...sampleProductDocs];
