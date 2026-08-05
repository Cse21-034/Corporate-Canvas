import React, { useState } from 'react';

interface Partner {
  name: string;
  /** simple-icons slug. Omit when the brand has no icon available. */
  slug?: string;
}

// Hikvision has no simple-icons entry, so it renders as a wordmark. Everything
// else was checked against the CDN and returns an SVG.
const PARTNERS: Partner[] = [
  { name: 'Dell', slug: 'dell' },
  { name: 'HP', slug: 'hp' },
  { name: 'Cisco', slug: 'cisco' },
  { name: 'Ubiquiti', slug: 'ubiquiti' },
  { name: 'Hikvision' },
];

function Wordmark({ name }: { name: string }) {
  return (
    <span className="font-display font-bold text-lg md:text-xl tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
      {name.toUpperCase()}
    </span>
  );
}

function PartnerMark({ partner }: { partner: Partner }) {
  // If the CDN is blocked or the slug disappears upstream, fall back to the
  // wordmark rather than leaving a broken-image icon on the page.
  const [failed, setFailed] = useState(false);

  if (!partner.slug || failed) {
    return <Wordmark name={partner.name} />;
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${partner.slug}`}
      alt={`${partner.name} logo`}
      width={112}
      height={32}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-7 md:h-8 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  );
}

export function PartnerLogos() {
  return (
    <ul className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-16">
      {PARTNERS.map((partner) => (
        <li
          key={partner.name}
          className="group flex h-8 items-center justify-center"
          title={partner.name}
        >
          <PartnerMark partner={partner} />
        </li>
      ))}
    </ul>
  );
}
