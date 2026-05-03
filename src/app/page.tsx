import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2">
            AI
          </div>
          <span className="font-bold tracking-tight">LearnPath AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center flex-col relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container flex flex-col items-center justify-center space-y-8 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Master any topic with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">AI-powered</span> learning paths.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Enter a subject, and our AI generates a comprehensive curriculum complete with modules, reading materials, and exercises tailored just for you.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base shadow-xl hover:scale-105 transition-transform duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2026 Abhijith Reddy. House of EdTech Assignment.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="https://github.com/">
            GitHub
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="https://linkedin.com/">
            LinkedIn
          </Link>
        </nav>
      </footer>
    </div>
  )
}
