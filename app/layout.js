import Logo from '@/app/_components/Logo';
import Navigation from '@/starter/components/Navigation';
import { Josefin_Sans } from 'next/font/google';
import '@/app/_styles/globals.css';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Welcome / The Wild Stay',
    template: '%s / The Wild Stay',
  },
  description:
    'A luxurious cabin hotel in the Italian Dolomites offers a breathtaking experience amidst the stunning mountain ranges. Surrounded by majestic peaks, lush valleys, and serene alpine beauty, it’s a perfect retreat for nature lovers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${josefin.className} bg-primary-950 min-h-screen text-primary-100`}
      >
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>Copyright by The Wild Stay</footer>
      </body>
    </html>
  );
}
