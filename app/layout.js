
import "./globals.css";
import {Orbitron} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'

const orbitron = Orbitron({subsets : ['latin']})



export const metadata = {
  title: "Memefy",
  description: "Song Generation Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.className} antialiased`}
      >
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
