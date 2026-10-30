import { Link } from "react-router-dom";

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/shop" },
  { label: "Ready-to-Wear", to: "/shop" },
  { label: "Custom Collection", to: "/design" },
  { label: "Dresses", to: "/shop" },
  { label: "Co-Ord Sets", to: "/shop" },
  { label: "Ethnic Wear", to: "/shop" },
  { label: "Western Wear", to: "/shop" },
  { label: "Archive Sale", to: "/shop", emphasis: true },
];

const ABOUT_LINKS = [
  { label: "About Us", to: "/" },
  { label: "Perfect Fit Guarantee", to: "/" },
  { label: "Digital Body Profile", to: "/profile" },
  { label: "Experience Stores", to: "/" },
  { label: "7Style Journal & Blog", to: "/" },
];

const HELP_LINKS = [
  { label: "Contact Concierge", to: "/" },
  { label: "Shipping & Delivery", to: "/" },
  { label: "Complimentary Returns", to: "/" },
  { label: "Bespoke Size Guide", to: "/profile" },
  { label: "FAQs", to: "/" },
];

const INSTAGRAM_URL = "https://www.instagram.com/official_7style?rpxt=MWF4aDkydDlhc3gybQ==";
const PHONE_DISPLAY = "744 773 6733";
const PHONE_TEL = "+917447736733";

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string; emphasis?: boolean }[];
}) {
  return (
    <div>
      <p className="font-sans text-xs tracking-[0.25em] uppercase text-champagne mb-5">{title}</p>
      <ul className="space-y-3 font-sans text-sm text-bone/60">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className={`hover:text-champagne ${l.emphasis ? "text-bone/80 font-medium" : ""}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-bone mt-auto">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        <LinkColumn title="Shop" links={SHOP_LINKS} />
        <LinkColumn title="About" links={ABOUT_LINKS} />
        <LinkColumn title="Help" links={HELP_LINKS} />

        <div>
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-champagne mb-5">
            Social &amp; Connect
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="7Style on Instagram"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bone/10 hover:bg-bone/20 text-bone transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </a>

          <p className="font-sans text-base font-semibold text-bone mt-8 mb-2">
            Boutique Atelier Flagship
          </p>
          <address className="not-italic font-sans text-sm text-bone/60 leading-relaxed">
            347/9 P No D-25, Housing Board Colony,
            <br />
            Siolim Marna Rd, Ganeshpuri Mapusa,
            <br />
            Mapusa, North Goa, Goa, 403507
          </address>

          <p className="font-sans text-sm mt-3">
            <a href={`tel:${PHONE_TEL}`} className="text-champagne hover:underline">
             📞 {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-6 flex flex-col items-center gap-4 text-center">
          <p className="font-sans text-xs text-bone/50">
            © {new Date().getFullYear()} 7Style India. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 font-sans text-xs text-bone/50">
            <Link to="/" className="hover:text-champagne">Privacy Policy</Link>
            <Link to="/" className="hover:text-champagne">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
