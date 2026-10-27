import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import {
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  BedDouble,
  User,
  Trash2,
} from 'lucide-react';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [taskType, setTaskType] = useState('Cleaning');
  const [priority, setPriority] = useState('Medium');
  const [assignedStaff, setAssignedStaff] = useState('Housekeeping Crew Alpha');
  const [description, setDescription] = useState('Post checkout sanitation & fresh linen');
  const [modalError, setModalError] = useState('');
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [tasksRes, roomsRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/rooms'),
      ]);

      if (tasksRes.data.success) setTasks(tasksRes.data.tasks);
      if (roomsRes.data.success) setRooms(roomsRes.data.rooms);
    } catch (err) {
      console.error('Failed to load housekeeping data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!roomId) {
      setModalError('Please select a room');
      return;
    }

    try {
      const res = await api.post('/maintenance', {
        roomId,
        taskType,
        priority,
        assignedStaff,
        description,
      });

      if (res.data.success) {
        setAlertMessage({ type: 'success', text: 'Task scheduled successfully!' });
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/maintenance/${taskId}`, {
        status: newStatus,
        completed: newStatus === 'Completed',
      });

      if (res.data.success) {
        setAlertMessage({ type: 'success', text: `Task marked as ${newStatus}!` });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update task:', err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await api.delete(`/maintenance/${taskId}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete task:', err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Operations & Housekeeping
          </span>
          <h2 className="fw-bold font-heading text-dark mb-1">Housekeeping & Maintenance Schedule</h2>
          <p className="text-muted small mb-0">Track room sanitation, inspection protocols, and property maintenance repairs.</p>
        </div>

        <button
          onClick={() => {
            if (rooms.length > 0) setRoomId(rooms[0]._id);
            setShowModal(true);
          }}
          className="hp-btn-primary rounded-3 px-3 py-2 text-white fw-semibold small d-flex align-items-center gap-1 shadow-sm"
        >
          <Plus size={16} /> Schedule Task
        </button>
      </div>

      {alertMessage.text && (
        <div className={`alert alert-${alertMessage.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          {alertMessage.text}
          <button type="button" className="btn-close" onClick={() => setAlertMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Task Cards Columns (Pending, In Progress, Completed) */}
      <div className="row g-4">
        {['Pending', 'In Progress', 'Completed'].map((columnStatus) => {
          const colTasks = tasks.filter((t) => t.status === columnStatus);
          const statusBg =
            columnStatus === 'Pending'
              ? 'bg-warning-subtle text-warning-emphasis'
              : columnStatus === 'In Progress'
              ? 'bg-primary-subtle text-primary'
              : 'bg-success-subtle text-success';

          return (
            <div key={columnStatus} className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-pill px-2.5 py-1 fw-bold ${statusBg}`}>
                      {columnStatus}
                    </span>
                    <strong className="text-dark small font-monospace">({colTasks.length})</strong>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-4 text-muted small bg-light rounded-3 border border-dashed">
                      No {columnStatus.toLowerCase()} tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div key={task._id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-dark px-2 py-1 rounded-2">
                            Room {task.room?.roomNumber}
                          </span>
                          <span
                            className={`badge px-2 py-0.5 rounded-pill ${
                              task.priority === 'Urgent'
                                ? 'bg-danger text-white'
                                : task.priority === 'High'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary-subtle text-secondary'
                            }`}
                            style={{ fontSize: '0.68rem' }}
                          >
                            {task.priority} Priority
                          </span>
                        </div>

                        <h6 className="fw-bold text-dark mb-1">{task.taskType}</h6>
                        <p className="text-muted small mb-2" style={{ lineHeight: '1.5' }}>
                          {task.description}
                        </p>

                        <div className="d-flex align-items-center justify-content-between text-muted small pt-2 border-top">
                          <span>
                            <User size={13} className="me-1" /> {task.assignedStaff}
                          </span>
                          <span style={{ fontSize: '0.7rem' }}>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Fast Status Change Actions */}
                        <div className="d-flex gap-2 mt-3 pt-2 border-top justify-content-end">
                          {columnStatus === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(task._id, 'In Progress')}
                              className="btn btn-sm btn-outline-primary py-1 px-2.5 rounded-pill"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Start Task
                            </button>
                          )}
                          {columnStatus === 'In Progress' && (
                            <button
                              onClick={() => handleUpdateStatus(task._id, 'Completed')}
                              className="btn btn-sm btn-success py-1 px-2.5 rounded-pill"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Mark Completed
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="btn btn-sm btn-light text-danger p-1 rounded-circle"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Task Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
              <div className="modal-header bg-primary text-white py-3 px-4">
                <h5 className="modal-title fw-bold">Schedule Housekeeping / Maintenance</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                {modalError && <div className="alert alert-danger py-2 small mb-3">{modalError}</div>}

                <form onSubmit={handleCreateTask}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Room *</label>
                    <select
                      className="form-select"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      required
                    >
                      {rooms.map((r) => (
                        <option key={r._id} value={r._id}>
                          Room {r.roomNumber} - {r.title} ({r.roomType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Task Type</label>
                      <select
                        className="form-select"
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                      >
                        <option value="Cleaning">Turnover Cleaning</option>
                        <option value="Deep Cleaning">Deep Sanitization</option>
                        <option value="Inspection">Safety / Quality Inspection</option>
                        <option value="AC Repair">AC / Climate Repair</option>
                        <option value="Plumbing">Plumbing Service</option>
                        <option value="Electrical">Electrical Service</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-bold">Priority Level</label>
                      <select
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Staff / Crew</label>
                    <input
                      type="text"
                      className="form-control"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Instructions / Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="hp-btn-primary px-4 py-2">
                      Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Housekeeping;
