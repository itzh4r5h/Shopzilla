const ImageKit = require("imagekit");
const multer = require("multer");
const ErrorHandler = require("./errorHandler");

// initializing imagekit with credentials from env
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

// configuring multer for handling file uploads in memory
const maxSize = process.env.IMAGE_MAX_SIZE_IN_MB * 1024 * 1024
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new ErrorHandler("Only png and jpeg images are allowed",400), false);
    }
    cb(null, true);
  },
});

// function to upload image in imagekit
const uploadToImageKit = async (fileBuffer, fileName, folder) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString("base64"), // convert buffer to base64
      fileName,
      folder,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    return new ErrorHandler("Error while uploading...", 500);
  }
};

module.exports = { upload, uploadToImageKit,imagekit };
