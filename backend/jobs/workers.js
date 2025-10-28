const redis = require("../config/redis");
const { Worker } = require("bullmq");
const { User } = require("../models/User");
const { Variant } = require("../models/product/Variant");
const { imagekit } = require("../utils/uploadImages");

const startDeletionWorker = () => {
  const worker = new Worker(
    "deletion",
    async (job) => {
      if (job.name === "delete-user") {
        try {
          const user = await User.findById(job.data.userId);
          if (user && !user.isVerified) {
            await User.findByIdAndDelete(user._id);
            // Lookup socketId from userId
            const socketId = global._userSockets[user._id];
            if (socketId && global._io) {
              global._io.to(socketId).emit("userDeleted", {
                message: "account is deleted",
              });
            }
            console.log(`[Worker] Deleted unverified user: ${user.email}`);
          }
        } catch (error) {
          console.log("[Woker] Error deleting user: " + error.message);
        }
      }
      if (job.name === "delete-images") {
        try {
          const variant = await Variant.findOne({
            _id: job.data.variantId,
            imagesUploaded: false,
          });
          if (variant && !variant.imagesUploaded) {
            await Variant.findByIdAndDelete(variant._id);
            await imagekit.deleteFolder(
              `${process.env.PRODUCT_PICS_FOLDER}/${variant.product._id}/${variant._id}`
            );
            console.log(`[Worker] Deleted variant whose images not uploaded`);
          }
        } catch (error) {
          console.log("[Woker] Error deleting variant: " + error.message);
        }
      }
    },
    {
      connection: redis,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job failed: ${job.id}`, err);
  });
};

module.exports = { startDeletionWorker };
