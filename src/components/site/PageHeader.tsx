import Link from "next/link";

/** Page title block with a breadcrumb trail. Used by every interior page. */
export function PageHeader({
  title,
  lede,
  trail,
}: {
  title: string;
  lede?: string;
  trail: { name: string; href: string }[];
}) {
  return (
    <div className="u-wrap pt-8 md:pt-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-slate">
          {trail.map((t, i) => (
            <li key={t.href} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {i === trail.length - 1 ? (
                <span aria-current="page" className="text-graphite">
                  {t.name}
                </span>
              ) : (
                <Link href={t.href} className="hover:text-ink">
                  {t.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-6 border-t-2 border-ink pt-8">
        <h1 className="text-[var(--text-h1)]">{title}</h1>
        {lede ? (
          <p className="u-measure-wide mt-6 text-[var(--text-lede)] leading-relaxed text-graphite">
            {lede}
          </p>
        ) : null}
      </div>
    </div>
  );
}
