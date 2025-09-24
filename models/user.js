require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ROLES = require('./utils/roles');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'please provide a username'],
      maxlength: 20,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'please provide an email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'please provide a password'],
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character',
      ],
    },
    profilePicture: {
      imageUrl: {
        type: String,
        default: null,
      },
      cloudinaryId: {
        type: String,
        default: null,
      },
    },
    role: {
      type: String,
      required: false,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, role: this.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_LIFETIME }
  );
};

UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, role: this.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (candidate) {
  const isMatch = await bcrypt.compare(candidate, this.password);
  return isMatch;
};

UserSchema.methods.promoteToAdmin = async function () {
  if (this.role.toLowerCase() === 'admin') {
    throw new Error('User is already an admin');
  }
  this.role = ROLES.ADMIN;
  await this.save({ validateModifiedOnly: true });
  return this;
};

module.exports = mongoose.model('User', UserSchema);
