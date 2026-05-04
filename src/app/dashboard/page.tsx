import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus } from "lucide-react"
import { DeletePathButton } from "@/components/delete-buttons"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const learningPaths = await prisma.learningPath.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      modules: true
    }
  })

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Learning Paths</h1>
          <p className="text-muted-foreground mt-1">Manage and track your generated courses.</p>
        </div>
        <Link href="/dashboard/generate">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Generate New Path
          </Button>
        </Link>
      </div>

      {learningPaths.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed shadow-sm text-center bg-muted/20">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No learning paths yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You haven't generated any learning paths. Create your first one to start learning!
          </p>
          <Link href="/dashboard/generate">
            <Button>Generate Your First Path</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <Card key={path.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl line-clamp-1">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {path.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground bg-secondary/50 w-fit px-2.5 py-0.5 rounded-full">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  {path.modules.length} modules
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
                <Link href={`/dashboard/${path.id}`} className="w-full mr-2">
                  <Button variant="default" className="w-full">View Course</Button>
                </Link>
                <DeletePathButton id={path.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
