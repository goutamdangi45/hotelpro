const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    taskType: {
      type: String,
      enum: ['Cleaning', 'Inspection', 'Deep Cleaning', 'Sanitization', 'AC Repair', 'Plumbing', 'Electrical', 'Furniture'],
      default: 'Cleaning',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    assignedStaff: {
      type: String,
      default: 'Housekeeping Team Alpha',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      default: 'Post check-out thorough sanitation and linen renewal',
    },
    notes: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
