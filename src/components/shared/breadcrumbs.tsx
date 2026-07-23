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
      <ol className="flex items-center gap-2 text-sm text-fg-muted">
        <li>
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-2">
            <span>/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="transition hover:text-accent"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-fg-default">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
