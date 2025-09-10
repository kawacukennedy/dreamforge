import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Heart, Users, Trophy, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Placeholder data - replace with actual API calls
  const userStats = {
    storiesCreated: 12,
    totalLikes: 156,
    totalPlays: 2340,
    followers: 45,
    following: 32,
    joinedDate: '2024-01-01',
  }

  const recentActivity = [
    { type: 'story', action: 'Created "The Quantum Thief"', date: '2 days ago' },
    { type: 'like', action: 'Liked "Enchanted Grove Mystery"', date: '3 days ago' },
    { type: 'comment', action: 'Commented on "Space Odyssey"', date: '5 days ago' },
  ]

  const achievements = [
    { name: 'First Story', description: 'Created your first interactive story', earned: true },
    { name: 'Popular Creator', description: 'Received 100+ likes across all stories', earned: true },
    { name: 'Social Butterfly', description: 'Follow 50+ other creators', earned: false },
    { name: 'Master Storyteller', description: 'Create 25+ stories', earned: false },
  ]

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={session.user.avatar} alt={session.user.username} />
                <AvatarFallback className="text-2xl">
                  {session.user.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{session.user.username}</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {userStats.joinedDate}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{userStats.storiesCreated}</div>
                  <div className="text-xs text-muted-foreground">Stories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats.totalLikes}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats.totalPlays.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Plays</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats.followers}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions on DreamForge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {activity.type === 'story' && <BookOpen className="h-4 w-4 text-primary" />}
                    {activity.type === 'like' && <Heart className="h-4 w-4 text-red-500" />}
                    {activity.type === 'comment' && <Users className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>Your DreamForge milestones and badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.earned
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy 
                        className={`h-4 w-4 ${
                          achievement.earned ? 'text-yellow-500' : 'text-muted-foreground'
                        }`} 
                      />
                      <span className={`font-medium text-sm ${
                        achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </span>
                      {achievement.earned && (
                        <Badge variant="default" className="text-xs">Earned</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
