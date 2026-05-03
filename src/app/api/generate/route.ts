import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
})

const schema = z.object({
  title: z.string().describe("Catchy title of the learning path"),
  description: z.string().describe("A short 2-3 sentence description of the course"),
  modules: z.array(z.object({
    title: z.string().describe("Title of the module"),
    description: z.string().describe("What the module covers"),
    resources: z.array(z.object({
      title: z.string(),
      type: z.enum(['video', 'article', 'exercise', 'book']),
      description: z.string().optional(),
    }))
  }))
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { topic } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      console.log("No OPENAI_API_KEY found. Falling back to mock data.")
      // Return mock data for testing if no API key is provided
      const mockResult = {
        title: `Mastering ${topic}`,
        description: `An in-depth learning path generated for ${topic}. This covers all the fundamental and advanced concepts you need.`,
        modules: [
          {
            title: `Introduction to ${topic}`,
            description: `Get started with the basics of ${topic}.`,
            resources: [
              { title: `What is ${topic}?`, type: "article", description: "A gentle introduction." },
              { title: `Getting Started Guide`, type: "video", description: "Setup and installation." }
            ]
          },
          {
            title: `Advanced ${topic} Concepts`,
            description: `Deep dive into advanced topics and real-world applications.`,
            resources: [
              { title: `Deep Dive Architecture`, type: "article", description: "Understanding the core." },
              { title: `Practical Exercises`, type: "exercise", description: "Hands-on practice." }
            ]
          }
        ]
      }
      return NextResponse.json(mockResult)
    }

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema,
      prompt: `Generate a comprehensive learning path curriculum for the topic: "${topic}". It should be structured with modules and recommended resources.`,
    })

    return NextResponse.json(result.object)
  } catch (error: any) {
    console.error("AI Generation Error:", error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
