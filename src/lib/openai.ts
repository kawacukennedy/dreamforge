import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface StoryGenerationRequest {
  premise: string
  genre?: string
  style?: string
  constraints?: string[]
}

export interface StoryNode {
  id: string
  content: string
  choices: Choice[]
  isEnding: boolean
}

export interface Choice {
  id: string
  text: string
  nextNodeId: string
}

export interface GeneratedStory {
  title: string
  description: string
  firstNode: StoryNode
  characters: Character[]
  setting: string
}

export interface Character {
  name: string
  description: string
  role: string
}

export async function generateStory(request: StoryGenerationRequest): Promise<GeneratedStory> {
  const systemPrompt = `You are an AI storyteller that creates interactive branching narratives. 
  Generate a story structure with multiple choice points and branching paths. 
  Return a JSON response with the following structure:
  {
    "title": "Story title",
    "description": "Brief story description",
    "setting": "Story setting description",
    "characters": [{"name": "Character Name", "description": "Character description", "role": "protagonist/antagonist/supporting"}],
    "firstNode": {
      "id": "node_1",
      "content": "Opening story content (2-3 paragraphs)",
      "choices": [
        {"id": "choice_1", "text": "Choice text", "nextNodeId": "node_2"},
        {"id": "choice_2", "text": "Choice text", "nextNodeId": "node_3"}
      ],
      "isEnding": false
    }
  }
  
  Create engaging, immersive content appropriate for the given genre and style.`

  const userPrompt = `Create an interactive story based on this premise: "${request.premise}"
  ${request.genre ? `Genre: ${request.genre}` : ''}
  ${request.style ? `Style: ${request.style}` : ''}
  ${request.constraints?.length ? `Constraints: ${request.constraints.join(', ')}` : ''}
  
  Make the story engaging with clear character motivations and meaningful choices that affect the narrative direction.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.8,
    response_format: { type: "json_object" }
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('Failed to generate story content')
  }

  return JSON.parse(result) as GeneratedStory
}

export async function continueStory(
  currentNode: StoryNode,
  selectedChoiceId: string,
  context: { story: GeneratedStory; previousChoices: string[] }
): Promise<StoryNode> {
  const selectedChoice = currentNode.choices.find(c => c.id === selectedChoiceId)
  if (!selectedChoice) {
    throw new Error('Invalid choice selected')
  }

  const systemPrompt = `You are continuing an interactive branching story. Based on the context and the player's choice, 
  generate the next story node. Return a JSON response with this structure:
  {
    "id": "unique_node_id",
    "content": "Story content for this scene (2-3 paragraphs)",
    "choices": [
      {"id": "choice_id", "text": "Choice text", "nextNodeId": "next_node_id"}
    ],
    "isEnding": false // true if this concludes the story
  }
  
  Make choices meaningful and continue the narrative coherently.`

  const userPrompt = `Continue the story "${context.story.title}".
  
  Current scene: ${currentNode.content}
  Player chose: "${selectedChoice.text}"
  
  Previous story context:
  - Setting: ${context.story.setting}
  - Characters: ${context.story.characters.map(c => `${c.name} (${c.role}): ${c.description}`).join(', ')}
  - Previous choices: ${context.previousChoices.join(' -> ')}
  
  Generate the next scene based on the player's choice, maintaining story continuity and character consistency.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.8,
    response_format: { type: "json_object" }
  })

  const result = completion.choices[0]?.message?.content
  if (!result) {
    throw new Error('Failed to generate story continuation')
  }

  return JSON.parse(result) as StoryNode
}

