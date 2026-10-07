const navigation = [
  { label: "Overview", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Calendar", href: "/calendar" },
  { label: "Cluster evidence", href: "/evidence" },
  { label: "Validation", href: "/validation" },
  { label: "Methods", href: "/methods" },
  { label: "Seasonal", href: "/seasonal" },
] as const;

export function getNavigationForPath(path: string) {
  return navigation.map((item) => ({
    ...item,
    active:
      item.href === "/evidence"
        ? path.startsWith("/evidence")
        : path === item.href || (item.href === "/" && path === "/"),
  }));
}
