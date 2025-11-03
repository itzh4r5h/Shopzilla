const app = require('./app')
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
});

global._io = io; // make io available globally

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("registerUser", (userId) => {
    global._userSockets[userId] = socket.id;
    console.log(`User ${userId} is linked to socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    // remove from map if exists
    for (const [userId, sid] of Object.entries(global._userSockets)) {
      if (sid === socket.id) {
        delete global._userSockets[userId];
        break;
      }
    }
  });
});


// Handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(err.message);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1)
})


// connecting to database
const connectDatabase = require('./config/database')
connectDatabase()

const {startDeletionWorker} = require('./jobs/workers')


server.listen(process.env.PORT,()=>{
    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
    startDeletionWorker()
})
