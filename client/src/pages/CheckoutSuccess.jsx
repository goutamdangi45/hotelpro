import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import InvoiceModal from '../components/InvoiceModal';
import { CheckCircle, Calendar, CreditCard, FileText, ArrowRight, Home, Sparkles, Building2 } from 'lucide-react';

const CheckoutSuccess = () => {
  const location = useLocation();
  const { booking, payment } = location.state || {};
  const [showInvoice, setShowInvoice] = useState(false);

  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white text-center">
              {/* Animated Success Badge */}
              <div className="bg-success-subtle text-success p-3 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                <CheckCircle size={40} />
              </div>

              <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2" style={{ width: 'fit-content', margin: '0 auto' }}>
                <Sparkles size={14} className="me-1 mb-1" /> Reservation Confirmed
              </span>
              <h2 className="fw-bold font-heading text-dark mb-2">We Look Forward to Welcoming You!</h2>
              <p className="text-secondary mb-4" style={{ lineHeight: '1.6' }}>
                Your booking has been received, verified, and settled. A formal receipt and confirmation
                have been logged to your account.
              </p>

              {/* Confirmation Summary Card */}
              <div className="card bg-light border p-4 rounded-4 mb-4 text-start">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div>
                    <span className="text-muted small d-block">Booking Reference</span>
                    <strong className="fs-5 text-dark font-monospace">{booking.bookingNumber}</strong>
                  </div>
                  <span className="badge bg-success px-3 py-1.5 rounded-pill">
                    {booking.paymentStatus || 'PAID'}
                  </span>
                </div>

                <div className="row g-3 text-secondary small">
                  <div className="col-sm-6">
                    <strong className="text-dark d-block">Room Reserved:</strong>
                    <span>Room {booking.room?.roomNumber} - {booking.room?.title}</span>
                  </div>
                  <div className="col-sm-6">
                    <strong className="text-dark d-block">Total Settled:</strong>
                    <span className="fs-6 fw-bold text-primary">${booking.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="col-sm-6">
                    <strong className="text-dark d-block">Check-In:</strong>
                    <span>{new Date(booking.checkInDate).toLocaleDateString()} (from 3:00 PM)</span>
                  </div>
                  <div className="col-sm-6">
                    <strong className="text-dark d-block">Check-Out:</strong>
                    <span>{new Date(booking.checkOutDate).toLocaleDateString()} (until 11:00 AM)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <button
                  onClick={() => setShowInvoice(true)}
                  className="btn btn-outline-primary py-2.5 px-4 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                >
                  <FileText size={18} /> View & Print Tax Invoice
                </button>
                <Link
                  to="/my-bookings"
                  className="hp-btn-primary py-2.5 px-4 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                >
                  Manage Reservations <ArrowRight size={18} />
                </Link>
              </div>

              <div className="mt-4 pt-3 border-top text-muted small">
                Questions about your stay? Call Concierge at <strong>+1 (800) 555-HOTELPRO</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceModal
          show={showInvoice}
          onHide={() => setShowInvoice(false)}
          booking={booking}
          payment={payment}
        />
      )}
    </div>
  );
};

export default CheckoutSuccess;
