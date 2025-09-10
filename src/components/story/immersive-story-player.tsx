"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Heart,
  MessageCircle,
  Users
} from 'lucide-react'
import type { StoryNode, GeneratedStory } from '@/lib/gemini'

interface ImmersiveStoryPlayerProps {
  story: GeneratedStory & { id: string; genre?: string }
  currentNode: StoryNode
  onChoiceSelect: (choiceId: string) => Promise<void>
  isLoading?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function ImmersiveStoryPlayer({ 
  story, 
  currentNode, 
  onChoiceSelect, 
  isLoading = false,
  isFullscreen = false,
  onToggleFullscreen 
}: ImmersiveStoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [showChoices, setShowChoices] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const typewriterRef = useRef<NodeJS.Timeout | null>(null)

  // Typewriter effect
  useEffect(() => {
    if (!isPlaying) return

    setDisplayedText('')
    setShowChoices(false)
    
    const text = currentNode.content
    let index = 0
    
    const typewriter = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
        typewriterRef.current = setTimeout(typewriter, 30 + Math.random() * 20)
      } else {
        // Show choices after text is complete
        setTimeout(() => setShowChoices(true), 500)
      }
    }

    typewriter()

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
    }
  }, [currentNode.content, isPlaying])

  const skipText = () => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current)
    }
    setDisplayedText(currentNode.content)
    setShowChoices(true)
  }

  const handleChoiceSelect = async (choiceId: string) => {
    setSelectedChoice(choiceId)
    try {
      await onChoiceSelect(choiceId)
    } catch (error) {
      console.error('Error selecting choice:', error)
    } finally {
      setSelectedChoice(null)
    }
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-background overflow-hidden`}>
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent_25%),radial-gradient(circle_at_70%_80%,rgba(255,111,97,0.1),transparent_25%)]" />
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/2 via-transparent to-white/2" />
        </div>
      </div>

      {/* Top Controls Bar */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30 p-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-foreground hover:text-primary"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipText}
                className="text-foreground hover:text-primary"
                disabled={!isPlaying || showChoices}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-foreground hover:text-primary"
              >
                {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-primary border-primary/50">
                {story.genre || 'Adventure'}
              </Badge>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-sm">42</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">8</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">3</span>
                </Button>
              </div>

              {onToggleFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFullscreen}
                  className="text-foreground hover:text-primary"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Story Content */}
      <div className="flex items-center justify-center min-h-screen p-6 pt-32 pb-32">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Story Text */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-12 min-h-[300px] flex items-center justify-center">
            <div className="prose prose-lg prose-invert max-w-none">
              <motion.p 
                className="text-xl md:text-2xl leading-relaxed text-foreground font-medium"
                key={currentNode.id}
              >
                {displayedText}
                {isPlaying && !showChoices && (
                  <motion.span
                    className="inline-block w-0.5 h-6 bg-primary ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.p>
            </div>
          </div>

          {/* Story Choices */}
          <AnimatePresence>
            {showChoices && !currentNode.isEnding && currentNode.choices && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-primary mb-8">Choose your path...</h3>
                <div className="grid gap-4 max-w-2xl mx-auto">
                  {currentNode.choices.map((choice, index) => (
                    <motion.div
                      key={choice.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl w-full p-6 h-auto text-left justify-start hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-primary/50 group transition-all duration-300"
                        onClick={() => handleChoiceSelect(choice.id)}
                        disabled={isLoading || selectedChoice !== null}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center mr-4 group-hover:border-primary group-hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all">
                            <span className="text-primary font-bold">{index + 1}</span>
                          </div>
                          <span className="text-lg font-medium group-hover:text-primary transition-colors">
                            {choice.text}
                          </span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Story Ending */}
          <AnimatePresence>
            {currentNode.isEnding && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-8"
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-12 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">The End</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Your journey has reached its conclusion. Every choice you made shaped this unique adventure.
                  </p>
                </Card>
                
                <div className="flex justify-center space-x-4">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_rgba(0,255,255,0.4)] hover:shadow-[0_6px_30px_rgba(0,255,255,0.6)] transition-all" size="lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Like Story
                  </Button>
                  <Button variant="outline" className="backdrop-blur-xl bg-white/5 border border-white/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-primary/50" size="lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Share Thoughts
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl m-6 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Chapter 1</span>
            <div className="flex-1 mx-4">
              <div className="h-1 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
            <span>Scene 3 of 8</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
