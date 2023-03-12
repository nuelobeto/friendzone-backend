const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("create_room", (data) => {
    socket.join(data);
    console.log(`user: ${socket.id} joined room: ${data}`);
    socket.emit("room_created");
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("message_sent", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
