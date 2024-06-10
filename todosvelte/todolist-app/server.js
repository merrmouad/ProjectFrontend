import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes pour les tâches
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const task = await prisma.task.create({
    data: { title }
  });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
  
    try {
      let updatedTask;
  
      if (title !== undefined) {
        updatedTask = await prisma.task.update({
          where: { id: Number(id) },
          data: { title },
        });
      } else if (completed !== undefined) {
        updatedTask = await prisma.task.update({
          where: { id: Number(id) },
          data: { completed },
        });
      }
  
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Could not update task" });
    }
  });
  
  
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: Number(id) }
  });
  res.sendStatus(204);
});
app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
  
    try {
      const updatedTask = await prisma.task.update({
        where: { id: Number(id) },
        data: { 
          title: title !== undefined ? title : undefined,
          completed: completed !== undefined ? completed : undefined,
        },
      });
  
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Could not update task" });
    }
  });
  
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
