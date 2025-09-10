"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, BookOpen, Users, Heart, MessageCircle, Share2, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import type { StoryNode, GeneratedStory, Character } from '@/lib/openai'

interface StoryPlayerProps {
  story: GeneratedStory & { id: string }
  onChoiceSelect: (choiceId: string) => Promise<void>
  isLoading?: boolean
  currentNode?: StoryNode
}

export function StoryPlayer({ story, onChoiceSelect, isLoading, currentNode }: StoryPlayerProps) {
  const [selectedChoice, setSelectedChoice] = useState<string>('')
  const [history, setHistory] = useState<StoryNode[]>([])

  const node = currentNode || story.firstNode

  useEffect(() => {
    if (currentNode) {
      setHistory(prev => [...prev, currentNode])
    }
  }, [currentNode])

  const handleChoiceClick = async (choiceId: string) => {
    setSelectedChoice(choiceId)
    try {
      await onChoiceSelect(choiceId)
    } catch (error) {
      console.error('Error making choice:', error)
    } finally {
      setSelectedChoice('')
    }
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Story Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl">{story.title}</CardTitle>
                <p className="text-muted-foreground">{story.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{story.genre || 'Adventure'}</span>
                  <span>•</span>
                  <span>{story.setting}</span>
                </div>
              </div>
              
              {/* Story Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  42
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  8
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Characters Panel */}
      {story.characters && story.characters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Characters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {story.characters.map((character: Character, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Avatar>
                      <AvatarFallback>{character.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{character.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {character.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {character.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Story Content */}
      <motion.div
        key={node.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {node.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Choices */}
      {!node.isEnding && node.choices && node.choices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-3"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">What do you choose?</h3>
          </div>
          <div className="grid gap-3">
            {node.choices.map((choice, index) => (
              <motion.div
                key={choice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-primary/5"
                  onClick={() => handleChoiceClick(choice.id)}
                  disabled={isLoading || selectedChoice !== ''}
                >
                  <div className="flex items-center gap-3 w-full">
                    {(isLoading && selectedChoice === choice.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    ) : (
                      <Play className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{choice.text}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Story Ending */}
      {node.isEnding && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">The End</h3>
              <p className="text-muted-foreground mb-6">
                Your adventure has concluded. Thank you for playing!
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Like Story
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Leave Comment
                </Button>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
