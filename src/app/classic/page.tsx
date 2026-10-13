import type { Metadata } from 'next';
import Header from '@/components/header';
import Intro from '@/components/intro';
import SectionDivider from '@/components/section-divider';
import About from '@/components/about';
import Experience from '@/components/experience';
import Education from '@/components/education';
import Projects from '@/components/projects';
import Skills from '@/components/skills';
import Certifications from '@/components/certifications';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: "Timothy's Portfolio · Classic",
  description:
    'Personal portfolio showcasing my work and experience, as a scrolling page',
};

export default function ClassicPage() {
  return (
    <main className="flex flex-col items-center px-4">
      <Header />
      <Intro />
      <SectionDivider />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  );
}
