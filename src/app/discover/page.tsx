"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Heart, 
  Play, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react'
import { AnimatedDiv, StaggerContainer, HoverCard } from '@/components/ui/animated'
import { motion } from 'framer-motion'

const FEATURED_STORIES = [
  {
    id: '1',
    title: 'The Quantum Thief',
    description: 'A heist across multiple dimensions where every choice creates a new reality.',
    author: 'QuantumWriter',
    genre: 'Sci-Fi',
    estimatedTime: '25 min',
    plays: 1250,
    likes: 89,
    isNew: false,
    isFeatured: true,
    coverImage: null // Would be AI generated
  },
  {
    id: '2',
    title: 'Enchanted Grove Mystery',
    description: 'Uncover ancient secrets in a magical forest where nothing is as it seems.',
    author: 'MysticTales',
    genre: 'Fantasy',
    estimatedTime: '18 min',
    plays: 980,
    likes: 67,
    isNew: true,
    isFeatured: false,
    coverImage: null
  },
  {
    id: '3',
    title: 'Midnight Express',
    description: 'A noir thriller set aboard a train where everyone has deadly secrets.',
    author: 'NoirMaster',
    genre: 'Thriller',
    estimatedTime: '30 min',
    plays: 750,
    likes: 45,
    isNew: false,
    isFeatured: false,
    coverImage: null
  },
  {
    id: '4',
    title: 'Cyberpunk Dreams',
    description: 'Navigate the neon-lit streets of New Tokyo in 2087.',
    author: 'FutureVision',
    genre: 'Cyberpunk',
    estimatedTime: '22 min',
    plays: 1100,
    likes: 78,
    isNew: true,
    isFeatured: true,
    coverImage: null
  },
  {
    id: '5',
    title: 'Pirates of the Void',
    description: 'Space piracy meets high adventure in the outer rim.',
    author: 'StarRaider',
    genre: 'Adventure',
    estimatedTime: '35 min',
    plays: 2100,
    likes: 156,
    isNew: false,
    isFeatured: false,
    coverImage: null
  },
  {
    id: '6',
    title: 'The Last Library',
    description: 'In a world where books are forbidden, you guard the final collection.',
    author: 'BookKeeper',
    genre: 'Dystopian',
    estimatedTime: '28 min',
    plays: 890,
    likes: 92,
    isNew: true,
    isFeatured: false,
    coverImage: null
  }
]

const GENRES = ['All', 'Sci-Fi', 'Fantasy', 'Thriller', 'Adventure', 'Romance', 'Horror', 'Mystery', 'Cyberpunk', 'Dystopian']
const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'highest-rated', label: 'Highest Rated' }
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState('trending')

  const filteredStories = FEATURED_STORIES.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || story.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        <StaggerContainer className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-primary">Discover</span> Stories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore AI-crafted adventures. Every story is unique, every choice matters.
            </p>
          </div>

          {/* Search and Filters */}
          <AnimatedDiv delay={0.1}>
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search stories, authors, or themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  </div>
                  
                <div className="flex gap-3 items-center">
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                      <SelectContent>
                        {GENRES.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </AnimatedDiv>

          {/* Featured Section */}
          <AnimatedDiv delay={0.2}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-primary drop-shadow-[0_0_10px_currentColor]" />
                <h2 className="text-2xl font-bold text-foreground">Featured Stories</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {filteredStories.filter(story => story.isFeatured).map((story, index) => (
                  <AnimatedDiv key={story.id} delay={index * 0.1}>
                    <HoverCard>
                      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl h-full group overflow-hidden hover:bg-white/8 hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,255,255,0.1)] transition-all duration-300">
                        {/* Story Cover - Placeholder for AI generated image */}
                        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/30 overflow-hidden">
                          <div className="absolute inset-0 opacity-50">
                            <div className="w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/5" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-12 w-12 text-white/60" />
                          </div>
                          
                          {/* Play Button Overlay */}
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_rgba(0,255,255,0.4)] hover:shadow-[0_6px_30px_rgba(0,255,255,0.6)] transition-all">
                              <Play className="h-6 w-6 mr-2" />
                              Play Story
                            </Button>
                          </motion.div>

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                              Featured
                            </Badge>
                            {story.isNew && (
                              <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground shadow-[0_0_20px_rgba(255,111,97,0.5)]">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardHeader className="space-y-3 p-6">
                          <div className="flex items-start justify-between">
                            <Badge variant="outline" className="text-primary border-primary/50">
                              {story.genre}
                            </Badge>
                            <div className="text-sm text-muted-foreground font-medium">
                              by {story.author}
                            </div>
                          </div>
                          
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            <Link href={`/story/${story.id}`} className="hover:underline">
                              {story.title}
                            </Link>
                          </CardTitle>
                          
                          <CardDescription className="text-base leading-relaxed">
                            {story.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-6">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {story.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {story.plays.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {story.likes}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCard>
                  </AnimatedDiv>
                ))}
              </div>
            </div>
          </AnimatedDiv>

          {/* All Stories Grid */}
          <AnimatedDiv delay={0.3}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary drop-shadow-[0_0_10px_currentColor]" />
                <h2 className="text-2xl font-bold text-foreground">All Stories</h2>
                <span className="text-muted-foreground">
                  ({filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'})
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredStories.map((story, index) => (
                  <AnimatedDiv key={story.id} delay={index * 0.05}>
                    <HoverCard>
                      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl h-full group hover:bg-white/8 hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,255,255,0.1)] transition-all duration-300">
                        <CardHeader className="space-y-3 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-primary border-primary/50">
                                {story.genre}
                              </Badge>
                              {story.isNew && (
                                <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/50">
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              by {story.author}
                            </div>
                          </div>
                          
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            <Link href={`/story/${story.id}`} className="hover:underline">
                              {story.title}
                            </Link>
                          </CardTitle>
                          
                          <CardDescription className="text-base leading-relaxed">
                            {story.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-6 space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {story.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {story.plays.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {story.likes}
                              </span>
                            </div>
                          </div>
                          
                          <Button 
                            asChild 
                            className="w-full backdrop-blur-xl bg-white/5 border border-white/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_4px_20px_rgba(0,255,255,0.4)] transition-all"
                          >
                            <Link href={`/story/${story.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              Play Story
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </HoverCard>
                  </AnimatedDiv>
                ))}
              </div>
            </div>
          </AnimatedDiv>

          {/* Load More */}
          <AnimatedDiv delay={0.4}>
            <div className="text-center pt-8">
              <Button 
                size="lg" 
                className="backdrop-blur-xl bg-white/5 border border-white/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-primary/50 px-12"
                variant="outline"
              >
                Load More Stories
              </Button>
            </div>
          </AnimatedDiv>
        </StaggerContainer>
      </div>
    </div>
  )
}
