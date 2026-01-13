import type { Metadata } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";
import { cookies } from "next/headers";
import { AuthProvider } from "@/modules/auth/context/auth-provider";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "Advanced Todo Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get("user_info")?.value;
  let user = null;

  if (userInfo) {
    try {
      user = JSON.parse(decodeURIComponent(userInfo));
    } catch (e) {
      console.error("Failed to parse user cookie in layout", e);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${oxanium.variable} ${sourceCodePro.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
