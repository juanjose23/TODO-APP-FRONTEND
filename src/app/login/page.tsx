import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/modules/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="h-4 w-4" />
          </div>
          Todo App
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
