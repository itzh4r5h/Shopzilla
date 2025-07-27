const ImageKit = require("imagekit");
const multer = require("multer");
const ErrorHandler = require('./errorHandler')

// initializing imagekit with credentials from env
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

// configuring multer for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });



// function to upload images in imagekit
const uploadToImageKit = async (file, fileName, folder) => {

    const result = await imagekit.upload({
      file,
      fileName,
      folder,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  
};



module.exports = { upload, uploadToImageKit };
