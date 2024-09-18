const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/Routes');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const socket = require('socket.io');
const http = require('http');

// Use middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;
const mongoose = require('mongoose');

// Create an HTTP server and bind it to Socket.IO
const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"], // Allowed methods
        credentials: true
    }
});
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on("room:join", (data) => {
      const { email, room } = data;
      emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);
      io.to(room).emit("user:joined", { email, id: socket.id });
      socket.join(room);
      io.to(socket.id).emit("room:join", data);
    });
  
    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    });
  
    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });
  
    socket.on("peer:nego:needed", ({ to, offer }) => {
      console.log("peer:nego:needed", offer);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });
  
    socket.on("peer:nego:done", ({ to, ans }) => {
      console.log("peer:nego:done", ans);
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
  });
// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Use routes
app.use('/api/', routes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
