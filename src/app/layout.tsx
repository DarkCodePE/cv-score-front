import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Analyzer - Encuentra el talento perfecto",
  description: "Plataforma de búsqueda de empleo y gestión de talento",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="es">
      <body className={inter.className}>
      <Providers>
        {children}
      </Providers>
      </body>
      </html>
  );
}