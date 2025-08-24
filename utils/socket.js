import { Server } from "socket.io";
import Either from "./Either.js";

let io;

export const initSocket = (httpserver) => {
  io = new Server(httpserver, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.on('JoinGame', (idGame) =>{
        socket.join(`game_${idGame}`);
        console.log(`User ${socket.id} joined game_${idGame}`);
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected ${socket.id}`);
    });
  });

   return io;
};

export const getIo = () => {
    if(!io){
        new Either.left({message: 'Socket.io not initialized'});
    }
    return io;
}
