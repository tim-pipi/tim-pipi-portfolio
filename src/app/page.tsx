import { Archivo, Big_Shoulders_Display, JetBrains_Mono } from 'next/font/google';
import Range from '@/components/range/range';

const display = Big_Shoulders_Display({
  variable: '--font-range-display',
  weight: ['700', '800', '900'],
  subsets: ['latin'],
});

const body = Archivo({
  variable: '--font-range-body',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

const mono = JetBrains_Mono({
  variable: '--font-range-mono',
  weight: ['400', '600'],
  subsets: ['latin'],
});

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">Timothy Putra Prasetio, Software Engineer</h1>
      <Range
        className={`${display.variable} ${body.variable} ${mono.variable}`}
      />
    </main>
  );
}
