/**
 * Renders a `<script type="application/ld+json">` tag from an already-built
 * structured-data object (e.g. `services/buildFaqSchema.ts`'s FAQPage
 * schema, issue #11 site-faq-schema). Deliberately generic/domain-agnostic —
 * it just serializes whatever `data` it's given — so any future JSON-LD
 * block (breadcrumbs, article, ...) can reuse it instead of hand-rolling
 * another `dangerouslySetInnerHTML` script tag.
 */
export interface JsonLdProps {
  data: object;
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      data-slot="json-ld"
      // JSON-LD scripts require raw (unescaped) JSON content; `data` is
      // always our own serialized object, never raw user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export { JsonLd };
