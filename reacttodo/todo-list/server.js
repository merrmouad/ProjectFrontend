const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const port = 4000;

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, userId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        userId,
        done: false,
      },
    });
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Unable to create task" });
  }
});

app.delete("/api/tasks/:task_id", async (req, res) => {
  try {
    const task = await prisma.task.delete({
      where: {
        id: parseInt(req.params.task_id),
      },
    });
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Unable to delete task" });
  }
});

app.get("*", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log("Express server listening on: http://localhost:" + app.get("port"));
});
app.patch("/api/tasks/:task_id", async (req, res) => {
  console.log(`Received edit request for task ${req.params.task_id} with data:`, req.body);
  try {
    const { title, userId } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.task_id) },
      data: { title, userId }
    });
    console.log('Updated task:', task);
    res.json(task); // Return the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: "Unable to update task" });
  }
});
