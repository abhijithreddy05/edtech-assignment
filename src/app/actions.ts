"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createLearningPath(topic: string, curriculumData: any) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const learningPath = await prisma.learningPath.create({
    data: {
      title: curriculumData.title,
      description: curriculumData.description,
      topic,
      userId: session.user.id,
      modules: {
        create: curriculumData.modules.map((m: any, i: number) => ({
          title: m.title,
          description: m.description,
          order: i,
          resources: {
            create: m.resources?.map((r: any) => ({
              title: r.title,
              type: r.type,
              url: r.url,
              description: r.description,
            })) || []
          }
        }))
      }
    }
  })

  revalidatePath('/dashboard')
  return learningPath
}

export async function deleteLearningPath(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.learningPath.delete({
    where: { id, userId: session.user.id }
  })
  
  revalidatePath('/dashboard')
}

export async function deleteModule(id: string, learningPathId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Ensure user owns the learning path
  const path = await prisma.learningPath.findUnique({
    where: { id: learningPathId, userId: session.user.id }
  })
  
  if (!path) throw new Error("Unauthorized or not found")

  await prisma.module.delete({
    where: { id }
  })
  
  revalidatePath(`/dashboard/${learningPathId}`)
}
