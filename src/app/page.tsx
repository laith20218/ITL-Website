import { Header } from '@/components/itl/header';
import { Hero } from '@/components/itl/hero';
import { Services } from '@/components/itl/services';
import { About } from '@/components/itl/about';
import { Articles } from '@/components/itl/articles';
import { Contact } from '@/components/itl/contact';
import { Footer } from '@/components/itl/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
