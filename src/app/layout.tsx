import type { Metadata } from 'next'
import { Cairo, Amiri } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/itl/theme-provider'
import { AuthProvider } from '@/components/itl/auth-provider'
import { VisitTracker } from '@/components/itl/visit-tracker'

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  display: 'swap',
})

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ITL | من الفكرة إلى الحياة - خدمات احترافية متكاملة',
  description: 'فريق ITL يقدّم خدمات احترافية في البحث العلمي، الترجمة، التصميم، البرمجة، التسويق الرقمي والمونتاج. حوّل فكرتك إلى واقع مع فريق متخصص.',
  keywords: [
    'ITL', 'بحث علمي', 'ترجمة', 'تصميم', 'برمجة', 'تطوير مواقع',
    'تطبيقات', 'تسويق رقمي', 'مونتاج', 'هوية بصرية', 'بوتات تلغرام',
  ],
  authors: [{ name: 'فريق ITL' }],
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'ITL | من الفكرة إلى الحياة',
    description: 'خدمات احترافية متكاملة لتحويل أفكارك إلى واقع',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="dark">
      <body className={`${cairo.variable} ${amiri.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
            <VisitTracker />
            <Toaster />
            <SonnerToaster
              position="top-center"
              theme="dark"
              toastOptions={{
                style: {
                  background: '#0A0A0A',
                  border: '1px solid #D4AF3740',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
