import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { StoryCreator } from '@/components/story/story-creator'

export default async function CreatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/create')
  }

  return <StoryCreator />
}
