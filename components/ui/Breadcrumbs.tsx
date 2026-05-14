import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link
            href="/"
            className="text-primary-red hover:text-primary-red-dark hover:underline transition-colors"
          >
            Anasayfa
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-500">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="text-primary-red hover:text-primary-red-dark hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
