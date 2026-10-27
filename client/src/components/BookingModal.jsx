import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CreditCard,
  Users,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

const BookingModal = ({ show, onHide, room, initialDates, onBookingSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Helper date format YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  const defaultCheckIn = initialDates?.checkIn || formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultCheckOut = initialDates?.checkOut || formatDate(tomorrow);

  const [checkInDate, setCheckInDate] = useState(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialDates?.checkIn) setCheckInDate(initialDates.checkIn);
    if (initialDates?.checkOut) setCheckOutDate(initialDates.checkOut);
  }, [initialDates]);

  if (!show || !room) return null;

  // Nights calculation
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.max(0, end - start);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = room.pricePerNight * nights;
  const tax = Math.round(basePrice * 0.12 * 100) / 100;
  const serviceFee = 25;
  const totalAmount = Math.round((basePrice + tax + serviceFee) * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/rooms/${room._id}` } });
      return;
    }

    if (start >= end) {
      setErrorMessage('Check-out date must be at least 1 day after check-in date');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guests: { adults, children },
        paymentMethod,
        specialRequests,
        cardLast4: cardNumber.slice(-4) || '4242',
      };

      const res = await api.post('/bookings', payload);

      if (res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        onHide();
        if (onBookingSuccess) {
          onBookingSuccess(res.data.booking, res.data.payment);
        } else {
          navigate('/checkout-success', {
            state: { booking: res.data.booking, payment: res.data.payment },
          });
        }
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to complete reservation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-primary text-white py-3 px-4 border-0">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={20} className="text-warning" />
              <h5 className="modal-title fw-bold mb-0">Confirm Your Stay at HotelPro</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>

          <div className="modal-body p-4">
            {errorMessage && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                <Info size={18} />
                <div>{errorMessage}</div>
              </div>
            )}

            <div className="row g-4">
              {/* Left Column: Dates & Guest Selection */}
              <div className="col-lg-7">
                <form id="bookingForm" onSubmit={handleSubmit}>
                  {/* Selected Room Banner */}
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4 border">
                    <img
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80'}
                      alt={room.title}
                      className="rounded-3"
                      style={{ width: '80px', height: '65px', objectFit: 'cover' }}
                    />
                    <div>
                      <span className="badge bg-primary-subtle text-primary mb-1">
                        Room {room.roomNumber} • {room.roomType}
                      </span>
                      <h6 className="fw-bold mb-0 text-dark">{room.title}</h6>
                      <small className="text-muted">${room.pricePerNight} / night</small>
                    </div>
                  </div>

                  {/* Dates Selection */}
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">
                        <Calendar size={14} className="me-1" /> Check-in Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        value={checkInDate}
                        min={formatDate(new Date())}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">
                        <Calendar size={14} className="me-1" /> Check-out Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        value={checkOutDate}
                        min={checkInDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Guests Selection */}
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">
                        <Users size={14} className="me-1" /> Adults
                      </label>
                      <select
                        className="form-select rounded-3"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Adult' : 'Adults'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">
                        <Users size={14} className="me-1" /> Children
                      </label>
                      <select
                        className="form-select rounded-3"
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                      >
                        {[0, 1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Child' : 'Children'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Special Requests / Dietary / Arrival Time
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="e.g. Quiet room away from elevator, feather-free bedding, late check-in..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      <CreditCard size={14} className="me-1" /> Payment Option
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {['Credit Card', 'Debit Card', 'UPI / NetBanking', 'Cash on Arrival'].map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
                            paymentMethod === method
                              ? 'btn-primary text-white'
                              : 'btn-outline-secondary'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Pricing Breakdown & Instant Checkout */}
              <div className="col-lg-5">
                <div className="card bg-light border-0 rounded-4 p-4 h-100 d-flex flex-column">
                  <h6 className="fw-bold text-dark mb-3">Reservation Summary</h6>

                  <div className="d-flex justify-content-between text-secondary mb-2">
                    <span>
                      ${room.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}
                    </span>
                    <span className="fw-semibold text-dark">${basePrice.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between text-secondary mb-2">
                    <span>Hospitality Tax & GST (12%)</span>
                    <span className="fw-semibold text-dark">${tax.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between text-secondary mb-3">
                    <span>Concierge & Amenities Fee</span>
                    <span className="fw-semibold text-dark">${serviceFee.toFixed(2)}</span>
                  </div>

                  <hr className="my-2" />

                  <div className="d-flex justify-content-between align-items-baseline mb-4">
                    <span className="fw-bold fs-6 text-dark">Total Payable</span>
                    <span className="fs-3 fw-bolder text-primary font-heading">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Guarantee info */}
                  <div className="bg-white p-3 rounded-3 border mb-4 small text-secondary">
                    <div className="d-flex align-items-center gap-2 mb-1 text-success fw-semibold">
                      <CheckCircle2 size={16} /> Free Cancellation up to 24h before
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <ShieldCheck size={16} /> Instant Confirmation & Digital Key
                    </div>
                  </div>

                  {/* CTA Submit Button */}
                  <button
                    type="submit"
                    form="bookingForm"
                    disabled={loading}
                    className="hp-btn-primary w-100 py-3 rounded-3 fw-bold fs-6 shadow-sm mt-auto d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Securing Reservation...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        {isAuthenticated ? `Pay & Confirm $${totalAmount.toFixed(2)}` : 'Sign In to Reserve'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
