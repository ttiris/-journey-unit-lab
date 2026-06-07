import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password_hash: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar_url: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving (handled in auth service)
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export const User = mongoose.model('User', userSchema);
