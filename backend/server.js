import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import pkg from 'agora-access-token';
import { Server } from 'socket.io';
import http from 'http';

const { RtcTokenBuilder, RtcRole } = pkg;

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const APP_ID = "6aaf461638d144148e4cf28c95de56bb";
const APP_CERTIFICATE = "80973f24e98d4a6fb85768c780d1409c";


const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("register", ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} registered`);
  });

  socket.on("call-user", ({ from, to, channelName }) => {
    console.log(`Calling from ${from} to ${to} on channel ${channelName}`);
    io.to(to).emit("incoming-call", { from, channelName });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

app.get("/api/token", (req, res) => {
  const { channelName, uid } = req.query;
  if (!channelName || !uid) {
    return res.status(400).json({ error: "Missing channelName or uid" });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTs
  );

  res.json({ token });
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});