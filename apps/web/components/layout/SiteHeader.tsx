import Link from "next/link";
import { getNavigationForPath } from "@/config/nav";

type SiteHeaderProps = {
  title: string;
  activePath: string;
};

export function SiteHeader({ title, activePath }: SiteHeaderProps) {
  const navigation = getNavigationForPath(activePath);

  return (
    <header className="site-header">
      <div>
        <p className="brand">FIREFUSION</p>
        <h1 className="page-title">{title}</h1>
      </div>
      <nav aria-label="Main navigation" className="main-nav">
        {navigation.map((item) => (
          <Link key={item.href} className="nav-link" href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
