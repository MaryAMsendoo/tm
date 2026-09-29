import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EnquiryProvider } from "../context/EnquiryContext";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { EnquiryDrawer } from "../components/layout/EnquiryDrawer";
import { WhatsAppFab } from "../components/layout/WhatsAppFab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TM Artisan Enterprise",
  description: "Crafted furniture and luxury statement pieces for refined spaces.",
};

// Applies the saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("tm-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <EnquiryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <EnquiryDrawer />
          <WhatsAppFab />
        </EnquiryProvider>
      </body>
    </html>
  );
}