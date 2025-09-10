"use client"

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession, getProviders } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, BookOpen, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AnimatedDiv, 
  StaggerContainer, 
  PulseOnHover, 
  HoverCard 
} from '@/components/ui/animated'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const error = searchParams?.get('error')

  const [providers, setProviders] = useState<Record<string, any> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [credentialsLoading, setCredentialsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })

    // Get available providers
    getProviders().then(setProviders)
  }, [callbackUrl, router])

  const handleProviderSignIn = async (providerId: string) => {
    setIsLoading(true)
    try {
      await signIn(providerId, {
        callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setCredentialsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.ok) {
        router.push(callbackUrl)
      } else {
        // Error will be shown via URL params on redirect
        console.error('Sign in failed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setCredentialsLoading(false)
    }
  }

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.'
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
        return 'There was a problem with the OAuth provider. Please try again.'
      case 'Callback':
        return 'There was a problem signing you in. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with a different login method. Please sign in using your original method.'
      default:
        return error ? 'An error occurred during sign in. Please try again.' : null
    }
  }

  const errorMessage = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/20">
      <StaggerContainer className="w-full max-w-md space-y-8">
        <AnimatedDiv delay={0.1}>
          <HoverCard className="shadow-2xl">
            <Card className="border-0 backdrop-blur-sm bg-background/95">
              <CardHeader className="text-center space-y-4 pb-8">
                <motion.div 
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <BookOpen className="h-8 w-8 text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-lg">
                  Sign in to your DreamForge account to continue creating stories
                </CardDescription>
              </CardHeader>
          
              <CardContent className="space-y-6">
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </motion.div>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OAuth Providers */}
                <AnimatePresence>
                  {providers && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {Object.values(providers)
                        .filter((provider: Record<string, any>) => provider.id !== 'credentials')
                        .map((provider: Record<string, any>, index) => (
                          <AnimatedDiv key={provider.id} delay={index * 0.1}>
                            <PulseOnHover>
                              <Button
                                variant="outline"
                                size="lg"
                                className="w-full backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                                onClick={() => handleProviderSignIn(provider.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Loader2 className="mr-2 h-4 w-4" />
                                  </motion.div>
                                ) : provider.id === 'google' ? (
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                      <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                      />
                                      <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                      />
                                      <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                      />
                                      <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                      />
                                    </svg>
                                  </motion.div>
                                ) : null}
                                Continue with {provider.name}
                              </Button>
                            </PulseOnHover>
                          </AnimatedDiv>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Separator */}
                <AnimatedDiv delay={0.3}>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-4 text-muted-foreground font-medium">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </AnimatedDiv>

                {/* Credentials Form */}
                <AnimatedDiv delay={0.4}>
                  <form onSubmit={handleCredentialsSignIn} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-all"
                            required
                          />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-all"
                            required
                          />
                        </motion.div>
                      </div>
                    </div>
                    <PulseOnHover>
                      <Button 
                        type="submit" 
                        className="w-full h-12 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary" 
                        disabled={credentialsLoading}
                      >
                        {credentialsLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="mr-2 h-4 w-4" />
                            </motion.div>
                            Signing in...
                          </>
                        ) : (
                          'Sign in'
                        )}
                      </Button>
                    </PulseOnHover>
                  </form>
                </AnimatedDiv>

                {/* Sign Up Link */}
                <AnimatedDiv delay={0.5}>
                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don&apos;t have an account? </span>
                    <motion.div className="inline">
                      <Link 
                        href="/auth/signup" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                          Sign up
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </AnimatedDiv>
              </CardContent>
            </Card>
          </HoverCard>
        </AnimatedDiv>
      </StaggerContainer>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
