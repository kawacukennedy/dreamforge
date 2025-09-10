"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Clock,
  Trash2,
  Menu,
  X,
  BookOpen
} from 'lucide-react'
import { AnimatedDiv } from '@/components/ui/animated'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  createdAt: Date
  messages: ChatMessage[]
}

export function StoryCreator() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Space Adventure Story',
      lastMessage: 'Create a story about space exploration...',
      createdAt: new Date('2024-01-15'),
      messages: [
        {
          id: '1',
          type: 'user',
          content: 'Create a story about space exploration with aliens',
          timestamp: new Date('2024-01-15T10:00:00')
        },
        {
          id: '2',
          type: 'assistant',
          content: "I'll create an exciting space exploration story for you! Here's the beginning:\n\n**The Cosmic Frontier**\n\nCaptain Sarah Chen stood on the bridge of the starship *Endeavor*, gazing at the swirling nebula ahead. After three years of deep space travel, her crew had finally reached the Andromeda sector—a region where long-range sensors had detected unusual energy signatures that could only mean one thing: intelligent alien life.\n\n**What happens next?**\n\nA) Approach the nebula cautiously with shields raised\nB) Send a diplomatic message on all frequencies\nC) Launch a probe to gather more information",
          timestamp: new Date('2024-01-15T10:01:00')
        }
      ]
    },
    {
      id: '2',
      title: 'Fantasy Quest',
      lastMessage: 'A young wizard discovers a hidden spell...',
      createdAt: new Date('2024-01-14'),
      messages: []
    },
    {
      id: '3',
      title: 'Mystery Mansion',
      lastMessage: 'Detective arrives at the haunted mansion...',
      createdAt: new Date('2024-01-13'),
      messages: []
    }
  ])
  
  const [currentSession, setCurrentSession] = useState<string | null>(sessions[0]?.id || null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentSessionData = sessions.find(s => s.id === currentSession)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSessionData?.messages])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Story',
      lastMessage: '',
      createdAt: new Date(),
      messages: []
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSession(newSession.id)
  }

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSession === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId)
      setCurrentSession(remaining[0]?.id || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentSession) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    // Add user message
    setSessions(prev => prev.map(session => 
      session.id === currentSession 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            title: session.messages.length === 0 ? input.trim().slice(0, 30) + '...' : session.title,
            lastMessage: input.trim()
          }
        : session
    ))

    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateStoryResponse(input),
        timestamp: new Date()
      }

      setSessions(prev => prev.map(session => 
        session.id === currentSession 
          ? { 
              ...session, 
              messages: [...session.messages, assistantMessage]
            }
          : session
      ))

      setIsLoading(false)
    }, 2000)
  }

  const generateStoryResponse = (prompt: string): string => {
    // Simple story generation simulation
    return `Based on your prompt "${prompt}", here's an exciting story beginning:

**The Adventure Begins**

The story unfolds in a world where your imagination sets the boundaries. Our protagonist faces their first challenge, and the choices they make will shape the entire narrative.

**What happens next?**

A) Take the bold approach and face the challenge head-on
B) Look for a clever way around the obstacle  
C) Seek help from an unexpected ally

Choose your path to continue the story!`
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-muted/20 border-r border-border`}>
        <div className="p-4 space-y-4">
          {/* New Chat Button */}
          <Button 
            onClick={createNewSession}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New Story
          </Button>

          {/* Chat History */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-2">Recent Stories</h3>
            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSession === session.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">
                          {session.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.lastMessage || 'No messages yet'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {session.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">
                {currentSessionData?.title || 'Create Your Story'}
              </h1>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {!currentSessionData?.messages.length ? (
              <div className="text-center py-12">
                <AnimatedDiv delay={0.1}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Start Creating Your Story</h2>
                  <p className="text-muted-foreground mb-6">
                    Describe your story idea and I&apos;ll help bring it to life with AI-powered storytelling.
                  </p>
                  <div className="grid gap-2 max-w-md mx-auto">
                    <Button
                      variant="outline"
                      onClick={() => setInput("Create a fantasy adventure about a young mage discovering their powers")}
                      className="justify-start text-left h-auto p-3"
                    >
                      <span className="text-sm">Create a fantasy adventure about a young mage discovering their powers</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setInput("Write a sci-fi story set on a distant planet with alien civilizations")}
                      className="justify-start text-left h-auto p-3"
                    >
                      <span className="text-sm">Write a sci-fi story set on a distant planet with alien civilizations</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setInput("Create a mystery story in a haunted Victorian mansion")}
                      className="justify-start text-left h-auto p-3"
                    >
                      <span className="text-sm">Create a mystery story in a haunted Victorian mansion</span>
                    </Button>
                  </div>
                </AnimatedDiv>
              </div>
            ) : (
              currentSessionData.messages.map((message, index) => (
                <AnimatedDiv key={message.id} delay={index * 0.1}>
                  <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <Card className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                      <CardContent className="p-4">
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-medium text-secondary">You</span>
                      </div>
                    )}
                  </div>
                </AnimatedDiv>
              ))
            )}

            {/* Loading Message */}
            {isLoading && (
              <AnimatedDiv delay={0}>
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        Creating your story...
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedDiv>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your story idea or continue the adventure..."
                  className="pr-12"
                  disabled={isLoading || !currentSession}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading || !currentSession}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send your message and continue building your story
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
