import Toaster from "@rahoot/web/components/Toaster"
import { AssetsProvider } from "@rahoot/web/contexts/assetsProvider"
import { SocketProvider } from "@rahoot/web/contexts/socketProvider"
import type { Metadata } from "next"
import { Itim, Kanit, Mali, Montserrat, Pridi, Sarabun } from "next/font/google"
import { PropsWithChildren } from "react"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "thai"],
})

const pridi = Pridi({
  variable: "--font-pridi",
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
})

const itim = Itim({
  variable: "--font-itim",
  weight: ["400"],
  subsets: ["latin", "thai"],
})

const mali = Mali({
  variable: "--font-mali",
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
})

const sarabun = Sarabun({
  variable: "--font-sarabun",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "thai"],
})

export const metadata: Metadata = {
  title: "Rahoot !",
  icons: "/icon.svg",
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
    <body
      className={`${montserrat.variable} ${kanit.variable} ${pridi.variable} ${itim.variable} ${mali.variable} ${sarabun.variable} bg-background antialiased`}
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
