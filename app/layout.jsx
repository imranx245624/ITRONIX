import { Rajdhani, Poppins, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import Header from "../components/Header"
import RouteButtons from "../components/RouteButtons" // ensure this exists

const rajdhani = Rajdhani({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata = {
  title: "ITRONIX-2026 — Techland: where only the skilled survives | Guru Nanak College Techfest",
  description:
    "ITRONIX-2026 — Techland. 20-22 to 2026. A three-day inter-college techfest at Guru Nanak College, GTB Nagar — Hackathon,  web development , workshops and e-sports. Register now.",
  keywords:
    "techfest, college techfest, hackathon Mumbai, ITRONIX, Guru Nanak College",
  generator: "v0.app",
  metadataBase: new URL("https://itronix2k26.com"),
  alternates: {
    canonical: "https://itronix2k26.com",
  },
  openGraph: {
    title: "ITRONIX-2026 — Techland: where only the skilled survives ",
    description: "jan 2026. two-day techfest at Guru Nanak College with Hackathon, creative ,BGMI & more.",
    type: "website",
    url: "https://itronix2k26.com",
    siteName: "ITRONIX-2K26",
    images: [
      {
        url: "/itlogo.jpg",
        width: 1200,
        height: 630,
        alt: "ITRONIX-2K26 — A Simulated Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITRONIX-2K26 — A Simulated Future",
    description: "Three-day techfest: Hackathon, Robotics, AI & more. March 20–22, 2026.",
    images: ["/itlogo.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/itlogo.svg",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google_verification_code_here",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#04040B" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${rajdhani.variable} ${poppins.variable} ${jetbrainsMono.variable} font-poppins antialiased`}>
        {/* Header (unchanged for desktop & mobile) */}
        <Header />

        {/* Route buttons + left brand (desktop) and bottom dock (mobile). Component is client-side. */}
        <RouteButtons />

        {/* main gets top padding equal to header height to avoid overlap with fixed header */}
        <main className="pt-[var(--header-height)] md:pt-[var(--header-height)]">
          {children}
        </main>

        <Analytics />
      </body>
    </html>
  )
}
