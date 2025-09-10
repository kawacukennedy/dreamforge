import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Flame } from 'lucide-react'

async function fetchStories() {
  // Placeholder: replace with real API call to /api/fetch-stories
  return [
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
  ]
}

export default async function ExplorePage() {
  const stories = await fetchStories()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Stories</h1>
          <p className="text-muted-foreground mt-2">
            Discover trending adventures from the DreamForge community
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            Create a Story
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Card key={story.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary">{story.genre}</Badge>
                <div className="inline-flex items-center text-xs text-muted-foreground">
                  <Flame className="mr-1 h-4 w-4 text-primary" />
                  {story.plays.toLocaleString()} plays
                </div>
              </div>
              <CardTitle className="text-xl">
                <Link href={`/story/${story.id}`} className="hover:underline">
                  {story.title}
                </Link>
              </CardTitle>
              <CardDescription>{story.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>by {story.author}</span>
                <span>{story.likes} likes</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
