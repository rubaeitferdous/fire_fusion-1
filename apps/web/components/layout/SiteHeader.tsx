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
      <div className="site-header-main">
        <Link aria-label="FireFusion overview" className="brand-lockup" href="/">
          <span aria-hidden="true" className="brand-mark">
            F
          </span>
          <span className="brand-lockup-copy">
            <span className="brand">FIREFUSION</span>
            <span className="brand-caption">WILDFIRE OBSERVATION</span>
          </span>
        </Link>
        <div className="header-page-title">
          <p className="header-kicker">SENSOR-HARMONIZED INTELLIGENCE</p>
          <h1 className="page-title">{title}</h1>
        </div>
        <span className="header-status">
          <span aria-hidden="true" className="status-indicator" />
          DEMO ENVIRONMENT
        </span>
      </div>
      <nav aria-label="Main navigation" className="main-nav">
        {navigation.map((item) => (
          <Link
            aria-current={item.active ? "page" : undefined}
            key={item.href}
            className={`nav-link${item.active ? " active" : ""}`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
