"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteLearningPath, deleteModule } from "@/app/actions"
import { useTransition } from "react"
import { toast } from "sonner"

export function DeletePathButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault()
        startTransition(async () => {
          try {
            await deleteLearningPath(id)
            toast.success("Learning path deleted")
          } catch (error) {
            toast.error("Failed to delete")
          }
        })
      }}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}

export function DeleteModuleButton({ moduleId, pathId }: { moduleId: string, pathId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-muted-foreground hover:text-destructive shrink-0"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault()
        startTransition(async () => {
          try {
            await deleteModule(moduleId, pathId)
            toast.success("Module deleted")
          } catch (error) {
            toast.error("Failed to delete")
          }
        })
      }}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
