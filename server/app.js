import express from "express";
import { Server } from "socket.io";
const port = 3000;

const app = express();
const server = new Server(server)

app.get("/",(req,res)=>{
    res.send("Hello world!");
});
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})