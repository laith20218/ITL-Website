'use client';

import { ThemeProvider } from '@/components/itl/theme-provider';
import { AuthProvider } from '@/components/itl/auth-provider';
import { SessionProvider } from 'next-auth/react';
import { SoundProvider } from '@/components/itl/sound-provider';
import { PageTransition } from '@/components/itl/page-transition';
import { VisitTracker } from '@/components/itl/visit-tracker';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <SessionProvider>
          <SoundProvider>
            <PageTransition>
              {children}
            </PageTransition>
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
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}