import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRouter from "./routes/userRoute.js";
import { notFound } from "./Config/erroriddleware.js";
import chatRoute from "./routes/chatRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import messageRoutes from "./routes/messagesRoutes.js";

dotenv.config();
const app = express();
const url = process.env.CLIENT_URL;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(cookieParser());
connectDb();
app.get("/", (rqe, res) => {
  res.send("API is running successfully");
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoutes);

app.use(notFound);

const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, (req, res) => {
  console.log("Server is running in PORT", port);
});
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connection");
  });
  socket.on("join-chat", (room) => {
    socket.join(room);
  });
  socket.on("typing", (room, userId) => {
    socket.in(room).emit("typing", userId);
  });
  socket.on("stop-typing", (room, userId) => {
    socket.in(room).emit("stop-typing", userId);
  });
  socket.on("send-new-message", (newMessage) => {
    var chat = newMessage?.chat;

    if (!chat?.users) {
      return console.log("Chat.users not defined");
    }
    chat?.users?.forEach((user) => {
      if (user?._id === newMessage.sender._id) {
        return;
      } else {
        socket.in(user._id).emit("newMessage-received", newMessage);
      }
    });
  });
});
