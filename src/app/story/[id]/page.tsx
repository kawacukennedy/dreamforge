"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { StoryPlayer } from '@/components/story/story-player'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { GeneratedStory, StoryNode } from '@/lib/openai'

export default function StoryPage() {
  const params = useParams()
  const storyId = params.id as string

  const [story, setStory] = useState<(GeneratedStory & { id: string }) | null>(null)
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [choiceLoading, setChoiceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (storyId) {
      fetchStory()
    }
  }, [storyId])

  const fetchStory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stories/${storyId}`)
      
      if (!response.ok) {
        throw new Error('Story not found')
      }

      const data = await response.json()
      setStory(data.story)
      
      // Set current node from story content
      if (data.story.contentJson) {
        const contentJson = data.story.contentJson
        const currentNodeId = contentJson.currentNodeId || contentJson.firstNode?.id
        if (currentNodeId && contentJson.nodes) {
          setCurrentNode(contentJson.nodes[currentNodeId])
        } else if (contentJson.firstNode) {
          setCurrentNode(contentJson.firstNode)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load story')
    } finally {
      setLoading(false)
    }
  }

  const handleChoiceSelect = async (choiceId: string) => {
    if (!story || !currentNode) return

    setChoiceLoading(true)
    try {
      const response = await fetch('/api/continue-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: story.id,
          currentNodeId: currentNode.id,
          selectedChoiceId: choiceId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to continue story')
      }

      const data = await response.json()
      setCurrentNode(data.nextNode)

      // Update the story data to reflect the new state
      if (story.contentJson) {
        setStory(prev => prev ? {
          ...prev,
          contentJson: {
            ...prev.contentJson,
            nodes: {
              ...prev.contentJson.nodes,
              [data.nextNode.id]: data.nextNode
            },
            currentNodeId: data.nextNode.id
          }
        } : null)
      }
    } catch (err) {
      console.error('Error selecting choice:', err)
      setError('Failed to continue story')
    } finally {
      setChoiceLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-20">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your adventure...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="container max-w-4xl py-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Story Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {error || 'The story you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/explore">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Stories
                </Link>
              </Button>
              <Button asChild>
                <Link href="/create">
                  Create New Story
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <StoryPlayer
      story={story}
      currentNode={currentNode || undefined}
      onChoiceSelect={handleChoiceSelect}
      isLoading={choiceLoading}
    />
  )
}
