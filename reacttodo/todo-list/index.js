import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  let tasks = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    include: {
      tasks: true,
    },
  });
  console.log(tasks);

  let task = await prisma.task.findUnique({
    select: {
      id: true,
      title: true,
      done: true,
      user: true,
    },
    where: {
      id: 1,
    },
  });
  console.log(task);

 task = await prisma.task.create({
     data: {
        title: "My task",
      },
    });

    console.log(task);

    task = await prisma.task.update({
      data: {
       title: "My updated task",
      },
      where: {
        id: 1,
      },
    });

     console.log(task);

    await prisma.task.updateMany({
      data: {
        done: true,
       },
     });

   tasks = await prisma.task.findMany({
     select: {
        id: true,
        title: true,
        done: true,
      },
     });

     console.log(tasks);

  tasks = await prisma.task.deleteMany({
     where: {
     id: {
         gt: 1,
        },
     },
     select: {
       id: true,
      },
    });

  await prisma.$disconnect();
}
await main();