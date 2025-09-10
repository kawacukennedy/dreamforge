import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { continueStory, StoryNode } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { storyId, currentNodeId, selectedChoiceId } = body

    if (!storyId || !currentNodeId || !selectedChoiceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the story from the database
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { author: true }
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const contentJson = story.contentJson as any
    const currentNode = contentJson.nodes[currentNodeId] as StoryNode
    
    if (!currentNode) {
      return NextResponse.json({ error: 'Current node not found' }, { status: 404 })
    }

    // Generate the next story node
    const nextNode = await continueStory(currentNode, selectedChoiceId, {
      story: contentJson,
      previousChoices: contentJson.previousChoices || []
    })

    // Update the story content with the new node
    const updatedContentJson = {
      ...contentJson,
      nodes: {
        ...contentJson.nodes,
        [nextNode.id]: nextNode
      },
      currentNodeId: nextNode.id,
      previousChoices: [
        ...(contentJson.previousChoices || []),
        currentNode.choices.find(c => c.id === selectedChoiceId)?.text || ''
      ]
    }

    // Save the updated story
    await prisma.story.update({
      where: { id: storyId },
      data: {
        contentJson: updatedContentJson,
        isCompleted: nextNode.isEnding
      }
    })

    return NextResponse.json({
      success: true,
      nextNode,
      isEnding: nextNode.isEnding
    })

  } catch (error) {
    console.error('Error continuing story:', error)
    return NextResponse.json(
      { error: 'Failed to continue story' },
      { status: 500 }
    )
  }
}
