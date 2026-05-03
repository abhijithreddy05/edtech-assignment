"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createLearningPath } from "@/app/actions"
import { Sparkles, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function GeneratePage() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      // 1. Generate curriculum using AI API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      if (!response.ok) throw new Error("Failed to generate curriculum")
      
      const curriculum = await response.json()
      
      // 2. Save to database using server action
      const savedPath = await createLearningPath(topic, curriculum)
      
      toast.success("Learning path generated successfully!")
      router.push(`/dashboard/${savedPath.id}`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate learning path. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Generate a Learning Path</CardTitle>
          <CardDescription className="text-base mt-2">
            What do you want to learn? Our AI will curate a structured curriculum with modules and resources for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <Input 
                placeholder="e.g. Quantum Computing, Advanced React Patterns, French for Beginners..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-14 text-lg px-4 border-primary/30 focus-visible:ring-primary/50 transition-all"
                disabled={isGenerating}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold group" 
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Curriculum...
                </>
              ) : (
                <>
                  Generate Course <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isGenerating && (
        <div className="mt-12 text-center animate-pulse">
          <p className="text-muted-foreground text-lg">
            Analyzing topic... Designing modules... Curating resources...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  )
}
