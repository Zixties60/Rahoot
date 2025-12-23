import Toaster from "@rahoot/web/components/Toaster"
import { AssetsProvider } from "@rahoot/web/contexts/assetsProvider"
import { SocketProvider } from "@rahoot/web/contexts/socketProvider"
import type { Metadata } from "next"
import {
  Itim,
  Kanit,
  Mali,
  Montserrat,
  Noto_Color_Emoji,
  Playpen_Sans_Thai,
  Pridi,
  Sarabun,
} from "next/font/google"
import { PropsWithChildren } from "react"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["400"],
  subsets: ["latin", "thai"],
})

const pridi = Pridi({
  variable: "--font-pridi",
  weight: ["400"],
  subsets: ["latin", "thai"],
})

const itim = Itim({
  variable: "--font-itim",
  weight: ["400"],
  subsets: ["latin", "thai"],
})

const mali = Mali({
  variable: "--font-mali",
  weight: ["400"],
  subsets: ["latin", "thai"],
})

const playpenSans = Playpen_Sans_Thai({
  variable: "--font-playpen-sans",
  weight: ["400"],
  subsets: ["latin", "thai"],
  adjustFontFallback: false,
})

const sarabun = Sarabun({
  variable: "--font-sarabun",
  weight: ["400"],
  subsets: ["latin", "thai"],
})

const notoColorEmoji = Noto_Color_Emoji({
  variable: "--font-noto-color-emoji",
  weight: ["400"],
  subsets: ["emoji"],
})

export const metadata: Metadata = {
  title: "Rahoot !",
  icons: "/icon.svg",
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
    <body
      className={`${montserrat.variable} ${kanit.variable} ${pridi.variable} ${itim.variable} ${mali.variable} ${playpenSans.variable} ${sarabun.variable} ${notoColorEmoji.variable} bg-secondary antialiased`}
    >
      <SocketProvider>
        <AssetsProvider>
          <main className="text-base-[8px] flex flex-col">{children}</main>
          <Toaster />
        </AssetsProvider>
      </SocketProvider>
    </body>
  </html>
)

export default RootLayout
