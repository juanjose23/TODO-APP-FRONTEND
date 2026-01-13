"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (!items.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((b, i) => (
          <BreadcrumbItem key={i} className="hidden md:block">
            {b.href ? (
              <BreadcrumbLink href={b.href}>{b.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{b.label}</BreadcrumbPage>
            )}
            {i < items.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
