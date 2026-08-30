import type { SeoSchemaRow } from "@/lib/seo";

/**
 * Renders each schema row as its own <script type="application/ld+json">
 * tag. Silently skips any row whose JSON fails to parse, so one bad entry
 * in the admin panel can never break the page for visitors.
 */
export default function JsonLd({ schemas }: { schemas: SeoSchemaRow[] }) {
  const valid = schemas.filter(s => {
    try {
      JSON.parse(s.schema_json);
      return true;
    } catch {
      return false;
    }
  });

  if (valid.length === 0) return null;

  return (
    <>
      {valid.map((s, i) => (
        <script
          key={s.id || i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: s.schema_json }}
        />
      ))}
    </>
  );
}
