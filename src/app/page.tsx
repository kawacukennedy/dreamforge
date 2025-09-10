"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Sparkles, Users, Zap, Trophy, ArrowRight } from 'lucide-react'
import { AnimatedDiv } from '@/components/ui/animated'

const featuredStories = [
  {
    id: '1',
    title: 'The Quantum Thief',
    description: 'A heist across multiple dimensions where every choice creates a new reality.',
    genre: 'Sci-Fi',
    plays: 1250,
    likes: 89,
    author: 'QuantumWriter',
  },
  {
    id: '2',
    title: 'Enchanted Grove Mystery',
    description: 'Uncover ancient secrets in a magical forest where nothing is as it seems.',
    genre: 'Fantasy',
    plays: 980,
    likes: 67,
    author: 'MysticTales',
  },
  {
    id: '3',
    title: 'Midnight Express',
    description: 'A noir thriller set aboard a train where everyone has deadly secrets.',
    genre: 'Thriller',
    plays: 750,
    likes: 45,
    author: 'NoirMaster',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <AnimatedDiv delay={0} className="inline-flex items-center bg-muted rounded-full px-4 py-2 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">AI-Powered Interactive Storytelling</span>
            </AnimatedDiv>
            
            <AnimatedDiv delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Create Epic Adventures <span className="text-primary">Together</span>
              </h1>
            </AnimatedDiv>
            
            <AnimatedDiv delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create branching narratives with AI, play with friends, and discover infinite worlds of imagination.
              </p>
            </AnimatedDiv>
            
            <AnimatedDiv delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" asChild>
                <Link href="/create">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Creating
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/explore">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Stories
                </Link>
              </Button>
            </AnimatedDiv>
            
            <AnimatedDiv delay={0.4} className="flex items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10K+ Players</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>5K+ Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>AI-Generated</span>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose DreamForge?
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience storytelling with innovative AI-powered features
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="text-center h-full">
              <CardHeader className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">AI Story Engine</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Advanced AI creates unique, engaging narratives from your ideas with branching storylines.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center h-full">
              <CardHeader className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl font-semibold">Collaborative Play</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Team up with friends in multiplayer sessions, each taking on different character roles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center h-full">
              <CardHeader className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Challenge Mode</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Push your creativity with constraints and daily challenges.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Trending Stories</h2>
              <p className="text-muted-foreground">
                Discover the most popular adventures our community is playing
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/explore">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStories.map((story) => (
              <Card key={story.id} className="cursor-pointer h-full hover:bg-muted/50 transition-colors">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">
                      {story.genre}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      by {story.author}
                    </div>
                  </div>
                  <CardTitle className="text-lg">
                    {story.title}
                  </CardTitle>
                  <CardDescription>
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {story.plays.toLocaleString()} plays
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {story.likes} likes
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <Card className="bg-muted/20 text-center">
            <CardContent className="p-8 sm:p-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  Ready to Begin Your Adventure?
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of storytellers creating amazing interactive experiences.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="lg" asChild>
                    <Link href="/create">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Your First Story
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/auth/signup">
                      Join the Community
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
