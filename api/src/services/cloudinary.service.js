const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary using environmental variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a Base64-encoded image string to Cloudinary.
 * If the string is already a URL or does not match Base64 pattern, returns the string unmodified.
 * @param {string} base64Str - The Base64 image data URI (or a normal URL)
 * @param {string} folder - The Cloudinary folder target
 * @returns {Promise<string>} The uploaded image secure CDN URL or original string
 */
const uploadBase64 = async (base64Str, folder = "atul_portfolio") => {
  if (!base64Str) return "";

  // If already a URL, return it directly
  if (
    base64Str.startsWith("http://") ||
    base64Str.startsWith("https://") ||
    base64Str.startsWith("//")
  ) {
    return base64Str;
  }

  // If it's not a Base64 image URI, return as-is
  if (!base64Str.startsWith("data:image/")) {
    return base64Str;
  }

  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder: folder
    });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};

/**
 * Uploads an array of Base64 strings to Cloudinary in parallel.
 * @param {string[]} base64Array - Array of Base64 image strings (or normal URLs)
 * @param {string} folder - The Cloudinary folder target
 * @returns {Promise<string[]>} Array of uploaded image CDN URLs
 */
const uploadBase64Batch = async (base64Array, folder = "atul_portfolio") => {
  if (!base64Array || !Array.isArray(base64Array)) return [];
  
  const uploadPromises = base64Array.map((item) => uploadBase64(item, folder));
  return Promise.all(uploadPromises);
};

module.exports = {
  uploadBase64,
  uploadBase64Batch,
  cloudinary
};
