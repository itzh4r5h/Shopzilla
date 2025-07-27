const redis = require('../config/redis');
const { Worker } = require("bullmq");
const {User} = require("../models/User");

const startUserDeletionWorker = () => {
  const worker = new Worker(
    "user-deletion",
    async (job) => {
      if (job.name === "delete-user") {
        try {
          const user = await User.findById(job.data.userId);
          if (user && !user.isVerified) {
            await User.findByIdAndDelete(user._id);
            console.log(`[Worker] Deleted unverified user: ${user.email}`);
          }
        } catch (error) {
          console.log("[Woker] Error deleting user: " + error.message);
        }
      }
    },
    {
     connection:redis
    }
  )

  worker.on('completed', job => {
    console.log(`[Worker] Job completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job failed: ${job.id}`, err);
  });
};


module.exports = {startUserDeletionWorker}
