import { Josefin_Sans } from 'next/font/google';
import '@/app/_styles/globals.css';
import Header from './_components/Header';
import { ReservationProvider } from './_components/ReservationContext';

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
        className={`${josefin.className} antialiased bg-primary-950 min-h-screen text-primary-100 flex flex-col relative`}
      >
        <Header />
        <div className='flex-1 px-8 py-12 grid'>
          <main className='max-w-7xl mx-auto w-full'>
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
