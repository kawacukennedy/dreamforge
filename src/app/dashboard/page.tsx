import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, PlusCircle, Edit, Users } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Placeholder user stories - replace with actual API call
  const userStories = [
    {
      id: '1',
      title: 'My Fantasy Adventure',
      description: 'A tale of magic and mystery in an enchanted realm.',
      genre: 'Fantasy',
      isCompleted: false,
      plays: 15,
      likes: 3,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Space Station Alpha',
      description: 'Survival horror in the depths of space.',
      genre: 'Sci-Fi',
      isCompleted: true,
      plays: 42,
      likes: 8,
      createdAt: '2024-01-10',
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Stories</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your created adventures
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Story
          </Link>
        </Button>
      </div>

      {userStories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Stories Yet</CardTitle>
            <CardDescription className="mb-6">
              Create your first interactive story and start sharing it with the world.
            </CardDescription>
            <Button asChild>
              <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Story
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userStories.map((story) => (
            <Card key={story.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant={story.isCompleted ? "default" : "secondary"}>
                    {story.isCompleted ? "Complete" : "Draft"}
                  </Badge>
                  <Badge variant="outline">{story.genre}</Badge>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/story/${story.id}`} className="hover:underline">
                    {story.title}
                  </Link>
                </CardTitle>
                <CardDescription>{story.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{story.plays} plays</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{story.likes} likes</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/story/${story.id}/edit`}>
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Link href={`/story/${story.id}`}>
                      <BookOpen className="mr-1 h-4 w-4" />
                      Play
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
