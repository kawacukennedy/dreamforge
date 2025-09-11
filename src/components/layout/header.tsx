"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Moon, Sun, BookOpen, User, Settings, LogOut, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { PulseOnHover } from "@/components/ui/animated"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <motion.header 
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex">
          <PulseOnHover>
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <BookOpen className="h-7 w-7 text-primary group-hover:text-primary/80 transition-colors" />
              </motion.div>
              <span className="hidden font-bold sm:inline-block text-xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                DreamForge
              </span>
            </Link>
          </PulseOnHover>
        </div>
        
        <nav className="flex flex-1 items-center justify-between space-x-2 text-sm font-medium">
          <div className="flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/explore"
                className="relative transition-colors hover:text-foreground text-foreground/70 font-medium px-3 py-2 rounded-md hover:bg-accent/50"
              >
                Explore
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.div>
            <AnimatePresence>
              {session && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/create"
                    className="relative transition-colors hover:text-foreground text-foreground/70 font-medium px-3 py-2 rounded-md hover:bg-accent/50"
                  >
                    Create
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            {mounted && (
              <motion.div 
                className="flex items-center space-x-2 bg-accent/50 rounded-full px-3 py-1.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotate: theme === 'dark' ? 180 : 0,
                    scale: theme === 'dark' ? 0.8 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-4 w-4 text-orange-500" />
                </motion.div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  className="data-[state=checked]:bg-primary"
                />
                <motion.div
                  animate={{ 
                    rotate: theme === 'dark' ? 0 : -180,
                    scale: theme === 'dark' ? 1 : 0.8
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-4 w-4 text-blue-500" />
                </motion.div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {session ? (
                <motion.div 
                  key="authenticated"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center space-x-3"
                >
                  <PulseOnHover>
                    <Button asChild variant="ghost" size="sm" className="shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10">
                      <Link href="/create">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Story
                      </Link>
                    </Button>
                  </PulseOnHover>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.user?.avatar} alt={session.user?.username} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground font-semibold">
                              {session.user?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session.user?.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Stories
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div 
                  key="unauthenticated"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center space-x-3"
                >
                  <PulseOnHover>
                    <Button variant="ghost" asChild className="hover:bg-accent/50">
                      <Link href="/auth/signin">
                        Sign In
                      </Link>
                    </Button>
                  </PulseOnHover>
                  <PulseOnHover>
                    <Button asChild className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary">
                      <Link href="/auth/signup">
                        Sign Up
                      </Link>
                    </Button>
                  </PulseOnHover>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
