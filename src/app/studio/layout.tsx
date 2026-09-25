import { NextStudioLayout } from "next-sanity/studio";

export { metadata, viewport } from "next-sanity/studio";

/**
 * A separate root layout (Next.js route-groups pattern) so Studio never
 * inherits the site's Tailwind globals, fonts, or design tokens — it has
 * its own complete theming system. See src/app/(site)/layout.tsx for the
 * site's root layout.
 */
export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextStudioLayout>{children}</NextStudioLayout>
      </body>
    </html>
  );
}
