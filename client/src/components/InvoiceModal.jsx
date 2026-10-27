import React from 'react';
import { Printer, Download, X, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

const InvoiceModal = ({ show, onHide, booking, payment }) => {
  if (!show || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = payment?.invoiceNumber || `INV-HP-${booking._id?.slice(-6)}`;
  const transactionId = payment?.transactionId || `TXN-${booking._id?.slice(-8)}`;
  const paymentDate = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Top Modal Controls (Hidden in Print) */}
          <div className="modal-header bg-light py-3 px-4 border-bottom no-print">
            <h6 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <Building2 size={18} className="text-primary" />
              Tax Invoice & Booking Receipt
            </h6>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-3"
              >
                <Printer size={14} /> Print Invoice
              </button>
              <button
                type="button"
                className="btn-close ms-2"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="modal-body p-4 p-md-5 invoice-box">
            {/* Header: Company & Invoice Info */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '38px', height: '38px' }}
                  >
                    <Building2 size={22} />
                  </div>
                  <div>
                    <span className="fs-4 fw-bold text-dark font-heading">Hotel</span>
                    <span className="fs-4 fw-bold text-primary font-heading">Pro</span>
                  </div>
                </div>
                <p className="text-secondary small mb-1">450 Grand Horizon Blvd, Coastal Bay, CA 90210</p>
                <p className="text-secondary small mb-1">Phone: +1 (800) 555-HOTELPRO • GST/TAX ID: HP-US-992381</p>
                <p className="text-secondary small mb-0">Email: billing@hotelpro.com</p>
              </div>

              <div className="text-end">
                <span className="badge bg-success-subtle text-success border border-success-subtle fs-6 px-3 py-1.5 rounded-pill mb-2">
                  {booking.paymentStatus === 'Refunded' ? 'REFUNDED' : 'PAID & CONFIRMED'}
                </span>
                <h6 className="fw-bold text-dark mb-1">INVOICE: #{invoiceNumber}</h6>
                <p className="text-muted small mb-1">Date: {paymentDate}</p>
                <p className="text-muted small mb-0">Ref: {booking.bookingNumber}</p>
              </div>
            </div>

            {/* Billed To / Reservation Summary */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6">
                <h6 className="text-uppercase text-muted fw-bold small tracking-wider mb-2">
                  Billed To (Guest)
                </h6>
                <p className="fw-bold text-dark mb-1 fs-6">{booking.user?.name || 'Valued Guest'}</p>
                <p className="text-secondary small mb-1">{booking.user?.email}</p>
                <p className="text-secondary small mb-1">{booking.user?.phone || 'Phone on file'}</p>
                {booking.user?.address && (
                  <p className="text-secondary small mb-0">{booking.user.address}</p>
                )}
              </div>

              <div className="col-sm-6 text-sm-end">
                <h6 className="text-uppercase text-muted fw-bold small tracking-wider mb-2">
                  Stay Details
                </h6>
                <p className="text-secondary small mb-1">
                  <strong className="text-dark">Room:</strong> Room {booking.room?.roomNumber} -{' '}
                  {booking.room?.title}
                </p>
                <p className="text-secondary small mb-1">
                  <strong className="text-dark">Check-In:</strong>{' '}
                  {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-secondary small mb-1">
                  <strong className="text-dark">Check-Out:</strong>{' '}
                  {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-secondary small mb-0">
                  <strong className="text-dark">Total Stay:</strong> {booking.totalNights} Nights
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered border-light-subtle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="py-2 text-secondary small">Description</th>
                    <th scope="col" className="py-2 text-center text-secondary small">Nights / Qty</th>
                    <th scope="col" className="py-2 text-end text-secondary small">Rate / Night</th>
                    <th scope="col" className="py-2 text-end text-secondary small">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3">
                      <strong className="text-dark d-block">
                        {booking.room?.roomType} Accommodation ({booking.room?.bedType || 'King Bed'})
                      </strong>
                      <span className="text-muted small">
                        Room {booking.room?.roomNumber} • Includes high-speed Wi-Fi & amenities
                      </span>
                    </td>
                    <td className="py-3 text-center">{booking.totalNights}</td>
                    <td className="py-3 text-end">${booking.roomPrice?.toFixed(2)}</td>
                    <td className="py-3 text-end fw-semibold">${booking.baseAmount?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-secondary small py-2">
                      Hospitality & Lodging Tax (12%)
                    </td>
                    <td className="text-end py-2 text-dark font-monospace">${booking.taxAmount?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-secondary small py-2">
                      Concierge & Resort Service Fee
                    </td>
                    <td className="text-end py-2 text-dark font-monospace">${(booking.serviceCharge || 25).toFixed(2)}</td>
                  </tr>
                  <tr className="table-light">
                    <td colSpan="3" className="text-end fw-bold text-dark fs-6 py-3">
                      Total Settled (USD)
                    </td>
                    <td className="text-end fw-bold fs-5 text-primary py-3 font-heading">
                      ${booking.totalAmount?.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Transaction Details & Policy Notice */}
            <div className="row g-3 pt-2 border-top">
              <div className="col-md-7">
                <h6 className="fw-bold small text-dark mb-1">Transaction Information</h6>
                <p className="text-muted small mb-1">
                  <strong>Transaction ID:</strong> {transactionId}
                </p>
                <p className="text-muted small mb-1">
                  <strong>Payment Method:</strong> {booking.paymentMethod} (Card ending in{' '}
                  {payment?.cardLast4 || '4242'})
                </p>
                <p className="text-muted small mb-0">
                  <strong>Special Notes:</strong> {booking.specialRequests || 'Standard reservation.'}
                </p>
              </div>
              <div className="col-md-5 text-md-end text-muted small">
                <p className="mb-1 text-success fw-semibold">
                  <ShieldCheck size={16} className="me-1 mb-1" />
                  Verified & Authenticated by HotelPro
                </p>
                <p className="mb-0">Thank you for choosing HotelPro. Have a wonderful stay!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
