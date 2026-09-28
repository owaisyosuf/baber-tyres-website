import { ClockIcon, LocationIcon, PhoneIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { formatPhoneDisplay } from "@/lib/format";
import { formatOpeningHours } from "@/lib/hours";
import type { ShopSettings } from "@/lib/settings";

/**
 * Address, opening hours, and a call button — read from the resolved shop
 * settings so no contact detail is typed into a page (R6). Shared by the
 * services, about, and (later) contact pages.
 */
export function ShopVisitDetails({
  settings,
  showCall = true,
}: {
  settings: ShopSettings;
  /** Hide the call button on a page that already has its own call action. */
  showCall?: boolean;
}) {
  const hours = formatOpeningHours(settings.hours);
  const phoneDisplay = formatPhoneDisplay(settings.phoneE164);

  return (
    <div className="flex flex-col gap-4">
      <address className="flex gap-3 not-italic text-body text-text">
        <LocationIcon className="mt-1 shrink-0 text-accent" size={20} />
        <span>
          {settings.addressLine}, {settings.city}
        </span>
      </address>
      <div className="flex gap-3">
        <ClockIcon className="mt-1 shrink-0 text-accent" size={20} />
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body">
          <dt className="text-text">{hours.days}</dt>
          <dd className="tabular text-muted">{hours.time}</dd>
          {hours.closedDay && (
            <>
              <dt className="text-text">{hours.closedDay}</dt>
              <dd className="text-muted">Closed</dd>
            </>
          )}
        </dl>
      </div>
      {showCall && (
        <div className="mt-2">
          <Button
            href={`tel:${settings.phoneE164}`}
            variant="secondary"
            icon={<PhoneIcon />}
            aria-label={`Call us on ${phoneDisplay}`}
          >
            Call {phoneDisplay}
          </Button>
        </div>
      )}
    </div>
  );
}
