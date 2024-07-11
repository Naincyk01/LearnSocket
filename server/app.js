import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = "asdasdsadasdasdasdsa";

const port = 3000;




const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  // we can use above cors code without using cors packege that we have installed
  // use of cors packege is when we have to use api then cors packege is used as middleware
});

app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

// here is how we can use cors package

app.get("/",(req,res)=>{
    res.send("Hello world!");
});


app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Login Success",
    });
});


io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));

    const decoded = jwt.verify(token, secretKeyJWT);
    next();
  });
});



io.on("connection",(socket)=>{
console.log("User connected!",socket.id);

socket.on("message", ({ room, message }) => {
  console.log({ room, message });
  // io.emit('received-message', message, socket.id) // will be sent to entire circuit
    // socket.broadcast.emit('received-message', message, socket.id) // will be sent to entire circuit except the sender
  socket.to(room).emit("receive-message", message);
  
});

socket.on("join-room", (room) => {
  socket.join(room);
  console.log(`User joined room ${room}`);
});

// socket.emit("welcome",`Welcome to the server,${socket.id}`);
// socket.broadcast.emit("welcome",`${socket.id} joined the server`);

socket.on("disconnect",()=>{
    console.log("user disconnected",socket.id);
})    
})

server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})