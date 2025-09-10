import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // If it's a 503 (overloaded) or 500 error, retry
      if (error.status === 503 || error.status === 500) {
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000
        console.log(`Gemini API error (${error.status}), retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // For other errors, don't retry
      throw error
    }
  }
  
  throw lastError
}

export async function generateStory(request: StoryGenerationRequest): Promise<GeneratedStory> {
  return retryWithBackoff(async () => {
    // Try gemini-1.5-flash first, fallback to gemini-1.5-pro if needed
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro']
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

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
        
        Make the story engaging with clear character motivations and meaningful choices that affect the narrative direction.
        
        Please respond with valid JSON only, no additional text.`

        const result = await model.generateContent([systemPrompt, userPrompt])
        const response = await result.response
        const text = response.text()

        try {
          // Clean up the response text to extract JSON
          const jsonText = text.replace(/```json\n?|```\n?/g, '').trim()
          const parsed = JSON.parse(jsonText) as GeneratedStory
          
          // Validate the response has required fields
          if (!parsed.title || !parsed.firstNode || !parsed.firstNode.content) {
            throw new Error('Invalid story structure returned')
          }
          
          return parsed
        } catch (parseError) {
          console.error(`Failed to parse ${modelName} response:`, text)
          if (modelName === models[models.length - 1]) {
            throw new Error('Failed to generate story content - invalid JSON format')
          }
          continue
        }
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error.message)
        if (modelName === models[models.length - 1]) {
          throw error
        }
        continue
      }
    }
    
    throw new Error('All models failed to generate story')
  })
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

  return retryWithBackoff(async () => {
    // Try gemini-1.5-flash first, fallback to gemini-1.5-pro if needed
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro']
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

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
        
        Generate the next scene based on the player's choice, maintaining story continuity and character consistency.
        
        Please respond with valid JSON only, no additional text.`

        const result = await model.generateContent([systemPrompt, userPrompt])
        const response = await result.response
        const text = response.text()

        try {
          const jsonText = text.replace(/```json\n?|```\n?/g, '').trim()
          const parsed = JSON.parse(jsonText) as StoryNode
          
          // Validate the response has required fields
          if (!parsed.id || !parsed.content || !parsed.choices) {
            throw new Error('Invalid story node structure returned')
          }
          
          return parsed
        } catch (parseError) {
          console.error(`Failed to parse ${modelName} response:`, text)
          if (modelName === models[models.length - 1]) {
            throw new Error('Failed to generate story continuation - invalid JSON format')
          }
          continue
        }
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error.message)
        if (modelName === models[models.length - 1]) {
          throw error
        }
        continue
      }
    }
    
    throw new Error('All models failed to generate story continuation')
  })
}
