import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // Transform the story data to match our interface
    const transformedStory = {
      id: story.id,
      title: story.title,
      description: story.description,
      genre: story.genre,
      contentJson: story.contentJson,
      author: story.author,
      likes: story._count.likes,
      comments: story._count.comments,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      isCompleted: story.isCompleted
    }

    return NextResponse.json({ 
      success: true, 
      story: transformedStory 
    })

  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}
