import { toast } from "react-toastify";
import { socket } from "./socket";

export const startSocketConnection = (loggedInUserId) => {
  if (!socket.connected) {
    socket.connect(); // connect only once
  }

  socket.emit("registerUser", loggedInUserId);

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("productImagesUploaded", (data) => {
    toast.success(data.message);
  });
};

export const stopSocketConnection = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};