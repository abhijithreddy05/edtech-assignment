import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex flex-col min-h-[100dvh] bg-muted/20">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2">
            AI
          </div>
          <span className="font-bold tracking-tight text-lg">LearnPath AI</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline-block">
            Welcome, {session.user.name || session.user.email}
          </span>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}>
            <Button variant="outline" size="sm">Sign Out</Button>
          </form>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
