import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import {
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);

  // Form State
  const [roomNumber, setRoomNumber] = useState('');
  const [title, setTitle] = useState('');
  const [roomType, setRoomType] = useState('Deluxe');
  const [pricePerNight, setPricePerNight] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [bedType, setBedType] = useState('King Size Bed');
  const [floor, setFloor] = useState(1);
  const [sizeSqFt, setSizeSqFt] = useState(400);
  const [status, setStatus] = useState('Available');
  const [amenitiesString, setAmenitiesString] = useState('High-Speed Wi-Fi, 55" Smart TV, Air Conditioning, Mini Fridge, Room Service');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80');
  const [description, setDescription] = useState('Spacious luxury suite with modern hospitality amenities and city views.');

  const [formError, setFormError] = useState('');
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentRoomId(null);
    setRoomNumber('');
    setTitle('');
    setRoomType('Deluxe');
    setPricePerNight('');
    setAdults(2);
    setChildren(1);
    setBedType('King Size Bed');
    setFloor(1);
    setSizeSqFt(400);
    setStatus('Available');
    setAmenitiesString('High-Speed Wi-Fi, 55" Smart TV, Air Conditioning, Mini Fridge, Room Service');
    setImageUrl('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80');
    setDescription('Spacious luxury suite with modern hospitality amenities.');
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setIsEditing(true);
    setCurrentRoomId(room._id);
    setRoomNumber(room.roomNumber);
    setTitle(room.title);
    setRoomType(room.roomType);
    setPricePerNight(room.pricePerNight);
    setAdults(room.capacity?.adults || 2);
    setChildren(room.capacity?.children || 0);
    setBedType(room.bedType || 'King Size Bed');
    setFloor(room.floor || 1);
    setSizeSqFt(room.sizeSqFt || 400);
    setStatus(room.status);
    setAmenitiesString(room.amenities ? room.amenities.join(', ') : '');
    setImageUrl(room.images?.[0] || '');
    setDescription(room.description || '');
    setFormError('');
    setShowModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setFormError('');

    const amenities = amenitiesString
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      roomNumber,
      title,
      roomType,
      pricePerNight: Number(pricePerNight),
      capacity: { adults: Number(adults), children: Number(children) },
      bedType,
      floor: Number(floor),
      sizeSqFt: Number(sizeSqFt),
      status,
      amenities,
      images: [imageUrl],
      description,
    };

    try {
      if (isEditing) {
        const res = await api.put(`/rooms/${currentRoomId}`, payload);
        if (res.data.success) {
          setAlertMessage({ type: 'success', text: 'Room updated successfully!' });
        }
      } else {
        const res = await api.post('/rooms', payload);
        if (res.data.success) {
          setAlertMessage({ type: 'success', text: 'New room added to inventory!' });
        }
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving room');
    }
  };

  const handleDeleteRoom = async (roomId, roomNum) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNum}? This action is irreversible.`)) {
      return;
    }

    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        setAlertMessage({ type: 'success', text: `Room ${roomNum} deleted successfully.` });
        fetchRooms();
      }
    } catch (err) {
      setAlertMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to delete room.',
      });
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const res = await api.put(`/rooms/${roomId}`, { status: newStatus });
      if (res.data.success) {
        setRooms(rooms.map((r) => (r._id === roomId ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      console.error('Failed to change room status:', err.message);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || r.roomType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Inventory & Asset Management
          </span>
          <h2 className="fw-bold font-heading text-dark mb-1">Room Inventory Control</h2>
          <p className="text-muted small mb-0">Add rooms, manage pricing, update room status and specifications.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="hp-btn-primary rounded-3 px-3 py-2 text-white fw-semibold small d-flex align-items-center gap-1 shadow-sm"
        >
          <Plus size={16} /> Add New Room
        </button>
      </div>

      {alertMessage.text && (
        <div className={`alert alert-${alertMessage.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          {alertMessage.text}
          <button type="button" className="btn-close" onClick={() => setAlertMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by room number or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end">
            <select
              className="form-select rounded-3"
              style={{ maxWidth: '200px' }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Presidential Suite">Presidential Suite</option>
              <option value="Family Suite">Family Suite</option>
              <option value="Single">Single</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>Room #</th>
                <th>Title / Type</th>
                <th>Price / Night</th>
                <th>Capacity</th>
                <th>Floor / Bed</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No rooms found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room._id}>
                    <td>
                      <span className="badge bg-dark fs-6 px-2.5 py-1.5 rounded-3">
                        {room.roomNumber}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=100&q=80'}
                          alt={room.title}
                          className="rounded-2"
                          style={{ width: '45px', height: '35px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="text-dark d-block small">{room.title}</strong>
                          <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.7rem' }}>
                            {room.roomType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="text-primary font-heading fs-6">${room.pricePerNight}</strong>
                    </td>
                    <td className="small text-secondary">
                      {room.capacity?.adults} Adults, {room.capacity?.children || 0} Kids
                    </td>
                    <td className="small text-secondary">
                      Floor {room.floor} • {room.bedType}
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm rounded-pill fw-semibold border-0 ${
                          room.status === 'Available'
                            ? 'bg-success-subtle text-success'
                            : room.status === 'Occupied'
                            ? 'bg-primary-subtle text-primary'
                            : 'bg-danger-subtle text-danger'
                        }`}
                        style={{ width: '130px' }}
                        value={room.status}
                        onChange={(e) => handleStatusChange(room._id, e.target.value)}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          onClick={() => openEditModal(room)}
                          className="btn btn-sm btn-light text-secondary rounded-2"
                          title="Edit Room"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                          className="btn btn-sm btn-light text-danger rounded-2"
                          title="Delete Room"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
              <div className="modal-header bg-primary text-white py-3 px-4">
                <h5 className="modal-title fw-bold">
                  {isEditing ? `Edit Room ${roomNumber}` : 'Add New Room to Inventory'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                {formError && (
                  <div className="alert alert-danger py-2 small mb-3">{formError}</div>
                )}

                <form onSubmit={handleSaveRoom}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Room Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 101, 204"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Room Category *</label>
                      <select
                        className="form-select"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                      >
                        <option value="Deluxe">Deluxe</option>
                        <option value="Executive Suite">Executive Suite</option>
                        <option value="Presidential Suite">Presidential Suite</option>
                        <option value="Family Suite">Family Suite</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Price / Night ($) *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="199"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Room Title / Display Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Deluxe King City Horizon"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Max Adults</label>
                      <input
                        type="number"
                        className="form-control"
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Max Children</label>
                      <input
                        type="number"
                        className="form-control"
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Floor</label>
                      <input
                        type="number"
                        className="form-control"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Area (Sq Ft)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sizeSqFt}
                        onChange={(e) => setSizeSqFt(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Bedding Type</label>
                      <input
                        type="text"
                        className="form-control"
                        value={bedType}
                        onChange={(e) => setBedType(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Inventory Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={amenitiesString}
                      onChange={(e) => setAmenitiesString(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Description</label>
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
                      {isEditing ? 'Save Changes' : 'Create Room'}
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

export default ManageRooms;
