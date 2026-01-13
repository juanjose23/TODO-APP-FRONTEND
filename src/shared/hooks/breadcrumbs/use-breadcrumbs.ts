"use client";

import { useSelectedLayoutSegments } from "next/navigation";

interface Breadcrumb {
  label: string;
  href: string;
}

export const useBreadcrumbs = (): Breadcrumb[] => {
  const segments = useSelectedLayoutSegments();
  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { label, href };
  });
};
