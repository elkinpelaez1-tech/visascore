import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "VisaScore | Calcula tu probabilidad de aprobación de la visa americana",
  description: "Descubre tu probabilidad de aprobación de la visa americana antes de aplicar. Analizamos tu perfil migratorio, tu DS-160 y generamos un VisaScore con fortalezas, riesgos y recomendaciones.",
  keywords: "Tramite de visa americana, visa americana, como tramitar la visa, probabilidad visa americana, analisis ds160, visa b1 b2 aprobacion, evaluar visa americana, riesgo migratorio visa, test visa americana",
  openGraph: {
    title: "VisaScore",
    description: "Calcula tu probabilidad de aprobación de la visa americana",
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://www.visascore.info",
  },
  manifest: "/manifest.json",
  themeColor: "#003366",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
