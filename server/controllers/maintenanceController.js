const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// @desc    Get all maintenance/housekeeping tasks
// @route   GET /api/maintenance
// @access  Private (Staff / Admin)
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, taskType } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (taskType && taskType !== 'All') query.taskType = taskType;

    const tasks = await Maintenance.find(query)
      .populate('room', 'roomNumber roomType status cleanlinessStatus floor')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new housekeeping/maintenance task
// @route   POST /api/maintenance
// @access  Private (Staff / Admin)
exports.createTask = async (req, res, next) => {
  try {
    const { roomId, taskType, priority, assignedStaff, description, notes } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId',
      });
    }

    const task = await Maintenance.create({
      room: roomId,
      taskType: taskType || 'Cleaning',
      priority: priority || 'Medium',
      assignedStaff: assignedStaff || 'Housekeeping Crew',
      reportedBy: req.user._id,
      description: description || 'Standard housekeeping / maintenance cycle',
      notes: notes || '',
    });

    // Optionally mark room as under maintenance or cleaning
    if (taskType === 'Cleaning' || taskType === 'Deep Cleaning') {
      await Room.findByIdAndUpdate(roomId, { cleanlinessStatus: 'Inspecting' });
    } else {
      await Room.findByIdAndUpdate(roomId, { status: 'Maintenance' });
    }

    const populatedTask = await Maintenance.findById(task._id).populate('room');

    res.status(201).json({
      success: true,
      task: populatedTask,
      message: 'Housekeeping / Maintenance task created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status or details
// @route   PUT /api/maintenance/:id
// @access  Private (Staff / Admin)
exports.updateTask = async (req, res, next) => {
  try {
    const { status, assignedStaff, notes, completed } = req.body;

    const task = await Maintenance.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (status) task.status = status;
    if (assignedStaff) task.assignedStaff = assignedStaff;
    if (notes !== undefined) task.notes = notes;

    if (status === 'Completed' || completed) {
      task.status = 'Completed';
      task.completedAt = new Date();

      // Automatically update room cleanliness back to Clean and status to Available if it was Maintenance
      await Room.findByIdAndUpdate(task.room, {
        cleanlinessStatus: 'Clean',
        status: 'Available',
      });
    }

    await task.save();

    const updatedTask = await Maintenance.findById(task._id).populate('room');

    res.status(200).json({
      success: true,
      task: updatedTask,
      message: 'Task updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Maintenance.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
