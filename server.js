const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const path = require("path");
const notificationRouter = require("./routes/notificationRouter");

let clients = new Map();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.use(express.json());

app.post('/heartbeat', (req, res) => {
  const clientId = req.body.clientId;

  if (clientId) {
    clients.set(clientId, Date.now());
    res.status(200).send('Heartbeat received');
  } else {
    res.status(400).send('Client ID required');
  }
});

// Kiểm tra các tín hiệu heartbeat mỗi 10 giây
setInterval(() => {
  const now = Date.now();
  clients.forEach((lastSeen, clientId) => {
    if (now - lastSeen > 15000) { // Timeout 15 giây
      console.log(`Client ${clientId} missed heartbeat`);
      clients.delete(clientId);
    }
  });
}, 10000);

app.listen(port, () => {});
