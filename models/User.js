import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: String,
  email: String,
  name: String,
  profileImage: String,
  virtualBalance: {
    type: Number,
    default: 100000, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
