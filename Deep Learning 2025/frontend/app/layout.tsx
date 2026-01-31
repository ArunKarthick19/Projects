import type React from "react"
import { ThemeProvider } from "../components/theme-provider"
import { Layout } from "../components/layout"
import { MalfunctionProvider } from "../contexts/MalfunctionContext"
import { CalibrationProvider } from "../contexts/CalibrationContext"
import './globals.css'

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MalfunctionProvider>
            <CalibrationProvider>
              <Layout>{children}</Layout>
            </CalibrationProvider>
          </MalfunctionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
