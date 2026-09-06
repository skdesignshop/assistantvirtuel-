import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { UserProvider } from "@/components/UserProvider";

export const metadata: Metadata = {
  title: "LE DESIGNER",
  description: "Assistant, fidélité, et univers LE DESIGNER — Telegram Mini App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* SDK officiel Telegram WebApp — doit être chargé avant tout le reste */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-background text-white font-body antialiased min-h-screen">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
