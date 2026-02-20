// app/layout.js
import { Inter, Sora } from 'next/font/google';
import "./globals.css";
import ScriptLoader from './ScriptLoader';
import { Toaster } from 'react-hot-toast';
import TitleManager from '@/components/Admin/TitleManager';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

export const metadata = {
  title: "ATD Money", 
  description: "Get instant payday loans & salary advance for salaried employees. Quick approval, minimal documentation, flexible repayment. Perfect for unexpected expenses before payday.",
  keywords: "payday loans, salary advance, instant loans, salaried persons loans, emergency cash, short term loans, quick loans, online loan app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1" />
      </head>
      <body>
        <ScriptLoader />
        <TitleManager /> 
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </body>
    </html>
  );
}