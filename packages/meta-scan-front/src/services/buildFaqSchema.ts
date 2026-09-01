// Builds a schema.org FAQPage JSON-LD object from the FAQ section's own
// dictionary entries (issue #11 site-faq-schema) — this is meta-scan's own
// SEO, distinct from the "FAQ schema generator" tool that builds this same
// shape for a *scanned* site (docs/feature/02-faq-schema-generator).
//
// Reuses `dictionaries/{ko,en}.json`'s `faq1Q~faq6Q`/`faq1A~faq6A` keys
// as-is (no new content) per the spec's "비고". The CTA copy
// (`faqCtaText`/`faqCtaButton`) is a call-to-action, not a Q&A pair, so it's
// deliberately never read here (req #2).
export function buildFaqSchema(t: Record<string, string | string[]>) {
  const faqIndexes = [1, 2, 3, 4, 5, 6] as const;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqIndexes.map((n) => ({
      "@type": "Question",
      name: t[`faq${n}Q`],
      acceptedAnswer: {
        "@type": "Answer",
        text: t[`faq${n}A`],
      },
    })),
  };
}
