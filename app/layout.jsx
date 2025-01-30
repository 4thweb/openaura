import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GridBackground from "@/components/Grid";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aura AI",
  description: "The aura of ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-svh bg-black w-full relative`}
      >
        <div className="fixed inset-0">
          <GridBackground />
        </div>
        <main className="relative z-10 min-h-svh bg-black/20">
          {children}
        </main>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      </body>
    </html>
  );
}
