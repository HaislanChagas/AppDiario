import type { Metadata } from "next";
import PWARegister from "./pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Aliados",
  description: "Lançamento diário de produtividade da equipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}