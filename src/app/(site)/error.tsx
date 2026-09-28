"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Button, Container } from "@/components/ui";
import { CATALOG_PATH } from "@/lib/filters";
import { formatPhoneDisplay } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink, genericInquiryMessage } from "@/lib/whatsapp";

/**
 * The page failed to render — usually Sanity being unreachable (NFR-11). The
 * header, footer, and sticky contact bar around it are still there; this adds
 * a plain message, a retry, and working contact actions. A client component
 * cannot fetch the shop settings, so it uses the confirmed defaults in
 * lib/site.ts, which are the same values the settings fall back to.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const phoneDisplay = formatPhoneDisplay(siteConfig.phoneE164);

  return (
    <Container className="py-16 md:py-24">
      <div role="alert" className="rounded-lg border border-border bg-surface p-6 sm:p-10">
        <h1 className="text-h2">This page could not load just now</h1>
        <p className="mt-3 max-w-[52ch] text-body text-muted">
          It is on our side. You can try again, or message or call us and we will help you
          directly.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            href={buildWhatsAppLink(genericInquiryMessage())}
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            aria-label="Chat with us on WhatsApp"
          >
            WhatsApp
          </Button>
          <Button
            href={`tel:${siteConfig.phoneE164}`}
            variant="secondary"
            icon={<PhoneIcon />}
            aria-label={`Call us on ${phoneDisplay}`}
          >
            Call {phoneDisplay}
          </Button>
          <Button type="button" variant="secondary" onClick={() => retry()}>
            Try again
          </Button>
        </div>
        <p className="mt-6 text-body">
          <Link href={CATALOG_PATH} className="text-accent underline underline-offset-4">
            Browse tyres
          </Link>
        </p>
      </div>
    </Container>
  );
}
