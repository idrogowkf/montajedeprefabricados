export default function SeoJsonLd({ schemas }: { schemas: Record<string, unknown>[] }) {
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</>;
}
