const { StatusCodes } = require('http-status-codes');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user');

//helper function to upload buffer to cloudinary

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'You must include an image' });
  }
  const user = await User.findById(req.user._id);
  const result = await uploadToCloudinary(req.file.buffer, {
    folder: 'profile-pictures',
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', format: 'auto' },
    ],
  });
  user.profilePicture = {
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
  };
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Profile picture uploaded successfully!' });
};

module.exports = uploadProfilePicture;
