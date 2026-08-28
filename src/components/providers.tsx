'use client';

/** Style: مسار الإنجاز الذهبي — مزودات واجهة خفيفة تجعل الحساب المحلي جزءًا هادئًا من رحلة العميل. */

import { ThemeProvider } from '@/components/itl/theme-provider';
import { AuthProvider } from '@/components/itl/auth-provider';
import { SoundProvider } from '@/components/itl/sound-provider';
import { PageTransition } from '@/components/itl/page-transition';
import { VisitTracker } from '@/components/itl/visit-tracker';
import { UiContentProvider } from '@/components/itl/ui-content-provider';
import { FloatingContact } from '@/components/itl/floating-contact';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <UiContentProvider>
          <SoundProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <FloatingContact />
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
          </SoundProvider>
        </UiContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
