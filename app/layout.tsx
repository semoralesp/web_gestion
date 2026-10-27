import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Barra from "@/components/barra";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electro Mechanic",
  description: "Sistema de gestión",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-light">
        <Barra />
        {children}
      </body>
    </html>
  );
}