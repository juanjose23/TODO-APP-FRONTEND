"use client";

import { ReactNode } from "react";
import { AppHeader, AppShell } from "@/shared/components/layout";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import { useBreadcrumbs } from "@/shared/hooks";

interface AppLayoutProps {
  children: ReactNode;
}

import { AuthProvider } from "@/modules/auth/context/auth-provider";

export default function AppLayout({ children }: AppLayoutProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <AppShell>
        <AppHeader>
          <Breadcrumbs items={breadcrumbs} />
        </AppHeader>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
    </AppShell>
  );
}
