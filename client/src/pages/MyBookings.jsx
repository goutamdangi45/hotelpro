import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import InvoiceModal from '../components/InvoiceModal';
import {
  Calendar,
  CreditCard,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  Clock,
  Sparkles,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
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

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? Full refund will be credited.')) {
      return;
    }

    setCancelLoadingId(bookingId);
    setActionMessage({ type: '', text: '' });

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`, {
        cancellationReason: 'Cancelled directly by guest from user portal',
      });

      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: 'Your reservation was successfully cancelled. Refund processed to your original payment method.',
        });
        fetchBookings();
      }
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel booking.',
      });
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleOpenInvoice = async (booking) => {
    try {
      const res = await api.get(`/bookings/${booking._id}`);
      if (res.data.success) {
        setSelectedBookingForInvoice({
          ...res.data.booking,
          payment: res.data.payment,
        });
        setShowInvoiceModal(true);
      }
    } catch (err) {
      setSelectedBookingForInvoice(booking);
      setShowInvoiceModal(true);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true;
    return b.bookingStatus === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill">Confirmed</span>;
      case 'Checked-In':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill">Checked In</span>;
      case 'Checked-Out':
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-1.5 rounded-pill">Completed</span>;
      case 'Cancelled':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1.5 rounded-pill">Cancelled & Refunded</span>;
      default:
        return <span className="badge bg-secondary px-3 py-1.5 rounded-pill">{status}</span>;
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
              Guest Portal
            </span>
            <h1 className="fw-bold font-heading display-6 text-dark mb-1">My Reservations</h1>
            <p className="text-muted mb-0">Track your confirmed stays, digital room keys, and download tax invoices.</p>
          </div>

          <Link to="/rooms" className="hp-btn-primary px-4 py-2.5 rounded-pill text-white fw-bold d-inline-flex align-items-center gap-2 shadow-sm">
            <Sparkles size={16} /> Book Another Stay
          </Link>
        </div>

        {actionMessage.text && (
          <div className={`alert alert-${actionMessage.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
            {actionMessage.text}
            <button type="button" className="btn-close" onClick={() => setActionMessage({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="d-flex gap-2 flex-wrap mb-4 bg-white p-2 rounded-4 shadow-sm border" style={{ width: 'fit-content' }}>
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

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading bookings...</span>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="p-3 bg-light rounded-circle mx-auto mb-3" style={{ width: 'fit-content' }}>
              <Calendar size={36} className="text-muted" />
            </div>
            <h4 className="fw-bold text-dark font-heading">No Reservations in this Category</h4>
            <p className="text-muted mb-4">You do not currently have any bookings with status "{statusFilter}".</p>
            <div>
              <Link to="/rooms" className="hp-btn-primary px-4 py-2.5 rounded-pill text-white fw-semibold">
                Find Your Next Luxury Stay
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredBookings.map((b) => (
              <div key={b._id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
                <div className="row g-4 align-items-center">
                  {/* Room Thumbnail & Title */}
                  <div className="col-lg-5 col-md-6 d-flex align-items-center gap-3">
                    <img
                      src={
                        b.room?.images?.[0] ||
                        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={b.room?.title}
                      className="rounded-3 shadow-sm flex-shrink-0"
                      style={{ width: '110px', height: '85px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-dark px-2 py-1 rounded-pill small">
                          Room {b.room?.roomNumber}
                        </span>
                        <span className="text-muted small">#{b.bookingNumber}</span>
                      </div>
                      <h5 className="fw-bold text-dark mb-1 font-heading">{b.room?.title}</h5>
                      <span className="text-muted small">{b.room?.roomType} • {b.guests?.adults} Adults</span>
                    </div>
                  </div>

                  {/* Stay Dates */}
                  <div className="col-lg-3 col-md-6">
                    <div className="text-secondary small">
                      <div className="d-flex align-items-center gap-1.5 mb-1">
                        <Calendar size={15} className="text-primary" />
                        <strong className="text-dark">Check-in:</strong>{' '}
                        {new Date(b.checkInDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="d-flex align-items-center gap-1.5 mb-1">
                        <Calendar size={15} className="text-primary" />
                        <strong className="text-dark">Check-out:</strong>{' '}
                        {new Date(b.checkOutDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <span className="badge bg-light text-secondary border">
                        {b.totalNights} {b.totalNights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>
                  </div>

                  {/* Financials & Status */}
                  <div className="col-lg-2 col-md-6">
                    <div className="mb-2">{getStatusBadge(b.bookingStatus)}</div>
                    <span className="fs-5 fw-bold text-primary font-heading d-block">
                      ${b.totalAmount?.toFixed(2)}
                    </span>
                    <small className="text-muted d-block">Settled via {b.paymentMethod}</small>
                  </div>

                  {/* Actions */}
                  <div className="col-lg-2 col-md-6 text-lg-end d-flex flex-lg-column gap-2 justify-content-end">
                    <button
                      onClick={() => handleOpenInvoice(b)}
                      className="btn btn-outline-primary btn-sm px-3 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-1"
                    >
                      <FileText size={15} /> Invoice
                    </button>

                    {['Confirmed'].includes(b.bookingStatus) && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancelLoadingId === b._id}
                        className="btn btn-outline-danger btn-sm px-3 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-1"
                      >
                        {cancelLoadingId === b._id ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <>
                            <XCircle size={15} /> Cancel Stay
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {b.keyCardIssued && (
                  <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 text-primary small bg-primary-subtle p-2 rounded-3">
                    <Key size={16} />
                    <strong>Digital Key Activated:</strong> Your mobile NFC key card is ready for Room {b.room?.roomNumber}.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Invoice Modal */}
      {showInvoiceModal && selectedBookingForInvoice && (
        <InvoiceModal
          show={showInvoiceModal}
          onHide={() => setShowInvoiceModal(false)}
          booking={selectedBookingForInvoice}
          payment={selectedBookingForInvoice.payment}
        />
      )}
    </div>
  );
};

export default MyBookings;
