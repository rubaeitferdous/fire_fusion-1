const navigationByPath = {
  "/map": [
    { label: "Calendar", href: "/calendar" },
    { label: "Cluster evidence", href: "/evidence" },
    { label: "Methods", href: "/methods" },
  ],
  "/calendar": [
    { label: "Map", href: "/map" },
    { label: "Cluster evidence", href: "/evidence" },
    { label: "Methods", href: "/methods" },
  ],
  "/evidence": [
    { label: "Map", href: "/map" },
    { label: "Calendar", href: "/calendar" },
  ],
  "/methods": [
    { label: "Map", href: "/map" },
    { label: "Calendar", href: "/calendar" },
    { label: "Evidence", href: "/evidence" },
  ],
  "/validation": [
    { label: "Cluster evidence", href: "/evidence" },
    { label: "Calendar", href: "/calendar" },
    { label: "Methods", href: "/methods" },
  ],
  "/seasonal": [
    { label: "Calendar", href: "/calendar" },
    { label: "Validation", href: "/validation" },
  ],
} as const;

export function getNavigationForPath(path: string) {
  return navigationByPath[path as keyof typeof navigationByPath] ?? [];
}
