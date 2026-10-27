import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import InvoiceModal from '../../components/InvoiceModal';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Key,
  LogOut,
  LogIn,
  FileText,
  Clock,
  User,
} from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        bookingStatus: newStatus,
      });

      if (res.data.success) {
        setAlertMessage({
          type: 'success',
          text: `Booking updated to ${newStatus} successfully!`,
        });
        fetchBookings();
      }
    } catch (err) {
      setAlertMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update status',
      });
    }
  };

  const handleToggleKeyCard = async (bookingId, currentVal) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        keyCardIssued: !currentVal,
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to toggle key card:', err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking and initiate refund?')) {
      return;
    }

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`, {
        cancellationReason: 'Cancelled by front desk administrator',
      });
      if (res.data.success) {
        setAlertMessage({
          type: 'success',
          text: 'Booking cancelled and refund recorded.',
        });
        fetchBookings();
      }
    } catch (err) {
      setAlertMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel',
      });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const s = search.toLowerCase();
    const matchesSearch =
      b.bookingNumber?.toLowerCase().includes(s) ||
      b.user?.name?.toLowerCase().includes(s) ||
      b.user?.email?.toLowerCase().includes(s) ||
      b.room?.roomNumber?.toLowerCase().includes(s);

    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Front Desk Operations
          </span>
          <h2 className="fw-bold font-heading text-dark mb-1">Reservation & Check-in Desk</h2>
          <p className="text-muted small mb-0">Manage guest arrivals, departures, digital key card distribution, and invoicing.</p>
        </div>
      </div>

      {alertMessage.text && (
        <div className={`alert alert-${alertMessage.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          {alertMessage.text}
          <button type="button" className="btn-close" onClick={() => setAlertMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Filter and Search Bar */}
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
                placeholder="Search guest name, email, booking #, or room #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end flex-wrap">
            {['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
                  statusFilter === tab
                    ? 'btn-primary text-white shadow-sm'
                    : 'btn-light text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>Booking Ref</th>
                <th>Guest Profile</th>
                <th>Room Info</th>
                <th>Stay Period</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Key Card</th>
                <th className="text-end">Front Desk Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No reservations matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="font-monospace fw-bold text-dark d-block">
                        {b.bookingNumber}
                      </span>
                      <small className="text-muted">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </small>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={b.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={b.user?.name}
                          className="rounded-circle"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="text-dark d-block small">{b.user?.name || 'Guest'}</strong>
                          <span className="text-muted small">{b.user?.phone || b.user?.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge bg-dark me-1">Room {b.room?.roomNumber}</span>
                      <small className="text-secondary d-block">{b.room?.roomType}</small>
                    </td>

                    <td className="small text-secondary">
                      <div>
                        {new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
                        {new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>
                        {b.totalNights} Nights
                      </span>
                    </td>

                    <td>
                      <strong className="text-primary font-heading">${b.totalAmount?.toFixed(2)}</strong>
                      <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge rounded-pill px-2.5 py-1 ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-success-subtle text-success'
                            : b.bookingStatus === 'Checked-In'
                            ? 'bg-primary-subtle text-primary'
                            : b.bookingStatus === 'Cancelled'
                            ? 'bg-danger-subtle text-danger'
                            : 'bg-secondary-subtle text-secondary'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => handleToggleKeyCard(b._id, b.keyCardIssued)}
                        className={`btn btn-sm rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 ${
                          b.keyCardIssued ? 'btn-success text-white' : 'btn-outline-secondary'
                        }`}
                        title="Click to toggle digital key card access"
                      >
                        <Key size={12} />
                        <span style={{ fontSize: '0.72rem' }}>
                          {b.keyCardIssued ? 'Issued' : 'Unissued'}
                        </span>
                      </button>
                    </td>

                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1 flex-wrap">
                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Checked-In')}
                            className="btn btn-sm btn-outline-success rounded-2 py-1 px-2 d-flex align-items-center gap-1"
                            title="Check In Guest"
                          >
                            <LogIn size={13} /> Check In
                          </button>
                        )}

                        {b.bookingStatus === 'Checked-In' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Checked-Out')}
                            className="btn btn-sm btn-outline-warning text-dark rounded-2 py-1 px-2 d-flex align-items-center gap-1"
                            title="Check Out Guest"
                          >
                            <LogOut size={13} /> Check Out
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedBookingForInvoice(b);
                            setShowInvoiceModal(true);
                          }}
                          className="btn btn-sm btn-light border rounded-2 py-1 px-2"
                          title="View Invoice"
                        >
                          <FileText size={14} />
                        </button>

                        {['Confirmed'].includes(b.bookingStatus) && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="btn btn-sm btn-light text-danger rounded-2 py-1 px-2"
                            title="Cancel Reservation"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedBookingForInvoice && (
        <InvoiceModal
          show={showInvoiceModal}
          onHide={() => setShowInvoiceModal(false)}
          booking={selectedBookingForInvoice}
        />
      )}
    </div>
  );
};

export default ManageBookings;
