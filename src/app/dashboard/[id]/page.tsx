import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlayCircle, FileText, CheckCircle, ExternalLink, BookOpen, Brain, Trash2 } from "lucide-react"
import { deleteModule } from "@/app/actions"

const iconMap: Record<string, React.ReactNode> = {
  video: <PlayCircle className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
  exercise: <CheckCircle className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />
}

export default async function LearningPathPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const path = await prisma.learningPath.findUnique({
    where: { 
      id: params.id,
      userId: session.user.id
    },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          resources: true
        }
      }
    }
  })

  if (!path) notFound()

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 uppercase tracking-widest">{path.topic}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-balance">{path.title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl text-balance">{path.description}</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium shrink-0">
            <Brain className="w-5 h-5" />
            <span>AI Generated</span>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative">
        <div className="absolute left-8 top-4 bottom-4 w-px bg-border hidden md:block"></div>
        {path.modules.map((mod, index) => (
          <Card key={mod.id} className="relative z-10 border-muted shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -left-12 top-6 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-primary hidden md:flex">
              {index + 1}
            </div>
            <CardHeader className="flex flex-row items-start justify-between bg-muted/30 pb-4 border-b">
              <div>
                <CardTitle className="text-xl md:text-2xl mb-1">{mod.title}</CardTitle>
                <CardDescription className="text-base">{mod.description}</CardDescription>
              </div>
              <form action={deleteModule.bind(null, mod.id, path.id)}>
                <Button type="submit" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </form>
            </CardHeader>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Learning Resources
              </h4>
              <ul className="space-y-3">
                {mod.resources.length === 0 && (
                  <li className="text-sm text-muted-foreground italic">No resources added yet.</li>
                )}
                {mod.resources.map(res => (
                  <li key={res.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                    <div className="mt-0.5 text-primary shrink-0">
                      {iconMap[res.type] || <ExternalLink className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{res.title}</p>
                      {res.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{res.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0 hidden sm:flex capitalize text-xs">
                      {res.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
