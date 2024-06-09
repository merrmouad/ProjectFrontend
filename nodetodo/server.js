// set up ======================================================================
var http = require("http");
var express = require("express");
var app = express(); // create our app w/ express
var cors = require("cors");

var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var path = require("path");
const { PrismaClient } = require("@prisma/client");

var port = 4000;

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location /public/img will be /img for users

// routes ======================================================================
app.use(cors());

// api ---------------------------------------------------------------------
// get all todos
app.get("/api/todos", async function (req, res) {
  const prisma = new PrismaClient();
  const todos = await prisma.todo.findMany();

  await prisma.$disconnect();

  res.json(todos);
});

app.get("/api/todos/:todo_id", function (req, res) {
  // use mongoose to get all todos in the database
});

// create todo and send back all todos after creation
app.post("/api/todos", async function (req, res) {
  const prisma = new PrismaClient();
  const todo = await prisma.todo.create({
    data: {
      text: req.body.text,
      done: false,
    },
  });
  const todos = await prisma.todo.findMany();
  await prisma.$disconnect();

  res.json(todos);
});

// app.put("/api/todos", function (req, res) {});
app.patch("/api/todos", function (req, res) {});

// delete a todo
app.delete("/api/todos/:todo_id", async function (req, res) {
  const prisma = new PrismaClient();
  const todo = await prisma.todo.delete({
    where: {
      id: parseInt(req.params.todo_id),
    },
  });
  const todos = await prisma.todo.findMany();
  await prisma.$disconnect();

  res.json(todos);
});

// application -------------------------------------------------------------
app.get("*", function (req, res) {
  res.sendFile("./public/index.html", { root: __dirname });
});

// listen (start app with node server.js) ======================================
var server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log(
    "Express server listening on: http://localhost:" + app.get("port")
  );
});