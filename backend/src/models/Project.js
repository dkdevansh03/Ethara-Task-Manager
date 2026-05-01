import mongoose from 'mongoose';
import config from '../config/constants.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: [config.ROLES.ADMIN, config.ROLES.MEMBER],
          default: config.ROLES.MEMBER,
        },
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Archived', 'Completed'],
      default: 'Active',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure owner is always in members array as admin
projectSchema.pre('save', async function (next) {
  const ownerExists = this.members.some((m) => m.user.toString() === this.owner.toString());
  if (!ownerExists) {
    this.members.push({
      user: this.owner,
      role: config.ROLES.ADMIN,
    });
  }
  next();
});

export default mongoose.model('Project', projectSchema);
