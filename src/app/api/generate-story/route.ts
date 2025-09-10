import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateStory, StoryGenerationRequest } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: StoryGenerationRequest = await request.json()
    const { premise, genre, style, constraints } = body

    if (!premise) {
      return NextResponse.json({ error: 'Premise is required' }, { status: 400 })
    }

    // Generate the story using OpenAI
    const generatedStory = await generateStory({
      premise,
      genre,
      style,
      constraints
    })

    // Save the story to the database
    const story = await prisma.story.create({
      data: {
        title: generatedStory.title,
        description: generatedStory.description,
        contentJson: {
          ...generatedStory,
          nodes: {
            [generatedStory.firstNode.id]: generatedStory.firstNode
          },
          currentNodeId: generatedStory.firstNode.id
        },
        genre: genre || null,
        authorId: session.user.id,
        isCompleted: false,
        isPublic: true
      }
    })

    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        title: story.title,
        description: story.description,
        ...generatedStory
      }
    })

  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}
