import { toast } from "react-toastify";
import { socket } from "./socket";

export const startSocketConnection = (loggedInUserId) => {
  if (!socket.connected) {
    socket.connect(); // connect only once
  }

  // Always re-register user when (re)connecting
  socket.off("connect"); // ensure only one connect handler
  socket.on("connect", () => {
    console.log("Connected:", socket.id);
    socket.emit("registerUser", loggedInUserId);
  });

  socket.off("productImagesUploaded"); // remove old listeners
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
