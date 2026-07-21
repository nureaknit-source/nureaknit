import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-medium-gray">
        <li>
          <Link href="/" className="transition hover:text-sage">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-2">
            <span>/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="transition hover:text-sage"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-charcoal">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
