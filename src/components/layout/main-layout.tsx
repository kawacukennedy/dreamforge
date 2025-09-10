"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "./header"

interface MainLayoutProps {
  children: React.ReactNode
  session?: any
}

export function MainLayout({ children, session }: MainLayoutProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with ❤️ by DreamForge. Powered by AI storytelling.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}
