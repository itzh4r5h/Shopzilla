const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongodb connected with server : ${data.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};


// exporting configured modules and functions
module.exports = connectDatabase;
