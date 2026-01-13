import { ReactNode } from "react";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

interface AppHeaderProps {
  children?: ReactNode;
}

export const AppHeader = ({ children }: AppHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {children}
      </div>
    </header>
  );
};
