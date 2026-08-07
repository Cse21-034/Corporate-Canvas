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
    <span className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground">
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
      width={224}
      height={64}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function PartnerLogos() {
  return (
    <ul className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-20">
      {PARTNERS.map((partner) => (
        <li
          key={partner.name}
          className="group flex h-12 md:h-16 items-center justify-center"
          title={partner.name}
        >
          <PartnerMark partner={partner} />
        </li>
      ))}
    </ul>
  );
}
