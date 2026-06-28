import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/itl/theme-provider";
import { AuthProvider } from "@/components/itl/auth-provider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ITL — Idea To Life | من الفكرة إلى الحياة",
  description:
    "فريق ITL متخصص في البحث العلمي، الترجمة الاحترافية، التصميم الجرافيكي، الإنتاج السمعي والبصري، التدريب، التسويق الرقمي، والطباعة الفاخرة.",
  keywords: [
    "ITL",
    "Idea To Life",
    "بحث علمي",
    "ترجمة",
    "تصميم جرافيكي",
    "هوية بصرية",
    "إنتاج أفلام",
    "تدريب",
    "تسويق رقمي",
    "طباعة",
  ],
  authors: [{ name: "ITL Team" }],
  openGraph: {
    title: "ITL — Idea To Life",
    description: "من الفكرة إلى الحياة — خدمات متكاملة بمعايير عالمية",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${amiri.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster />
            <Sonner position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
