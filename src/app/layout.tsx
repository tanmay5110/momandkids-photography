import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: 'Mom and Kids - Premium Baby & Maternity Photography Studio',
  description: 'Professional baby, maternity, newborn, and family photography studio. Capturing precious moments in Pune.',
  keywords: 'baby photography, maternity photography, newborn photography, family photography, Pune photographer',
  authors: [{ name: 'Mom and Kids' }],
  openGraph: {
    title: 'Mom and Kids - Premium Baby & Maternity Photography',
    description: 'Professional baby, maternity, newborn, and family photography studio',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/optimized/hero-slider/slide-1.webp" as="image" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${dmSans.variable} ${cormorant.variable} antialiased select-none`} suppressHydrationWarning>
        {/* Production Security Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable right-click context menu
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              
              // Disable keyboard shortcuts for dev tools and view source
              document.addEventListener('keydown', function(e) {
                // F12
                if (e.key === 'F12') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+I (Dev Tools)
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+J (Console)
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+U (View Source)
                if (e.ctrlKey && e.key === 'u') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+S (Save Page)
                if (e.ctrlKey && e.key === 's') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+C (Inspect Element)
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Disable drag on images
              document.addEventListener('dragstart', function(e) {
                if (e.target.tagName === 'IMG') {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
        {children}
        
        {/* WhatsApp Floating Button - Site Wide */}
        <a
          href="https://wa.me/919321130477?text=Hello!%20I%20would%20like%20to%20book%20a%20photoshoot%20session."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 z-50 shadow-lg hover:shadow-xl"
          aria-label="Contact us on WhatsApp"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
        
        <Analytics />
      </body>
    </html>
  );
}
