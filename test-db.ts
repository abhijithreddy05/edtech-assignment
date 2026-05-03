import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log("Users:", users)
    const newUser = await prisma.user.create({
      data: {
        email: "test_script@example.com",
        name: "test"
      }
    })
    console.log("Created:", newUser)
  } catch (e) {
    console.error("ERROR:", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
