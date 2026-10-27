import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import BookingModal from '../components/BookingModal';
import {
  Users,
  Bed,
  Square,
  Star,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  Coffee,
  Tv,
  Wifi,
  Wind,
  Bath,
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        console.error('Failed to load room details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading room details...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <h3>Room Not Found</h3>
        <p className="text-muted">The requested room does not exist in our inventory.</p>
        <Link to="/rooms" className="btn btn-primary rounded-pill px-4">
          Return to Rooms
        </Link>
      </div>
    );
  }

  const isAvailable = room.status === 'Available';

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link to="/rooms" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-1 fw-semibold small">
            <ArrowLeft size={16} /> Back to All Rooms & Suites
          </Link>
        </div>

        {/* Room Title & Rating Row */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary px-3 py-1.5 rounded-pill text-uppercase">
                {room.roomType}
              </span>
              <span className="badge bg-dark px-3 py-1.5 rounded-pill">
                Room {room.roomNumber}
              </span>
              <span
                className={`badge px-3 py-1.5 rounded-pill ${
                  isAvailable ? 'hp-badge-available' : 'hp-badge-occupied'
                }`}
              >
                {room.status}
              </span>
            </div>
            <h1 className="fw-bold font-heading display-6 text-dark mb-0">{room.title}</h1>
          </div>

          <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-4 shadow-sm border">
            <Star size={20} className="text-warning fill-warning" fill="#f59e0b" />
            <span className="fw-bold fs-5 text-dark">{room.rating || 4.9}</span>
            <span className="text-muted small">({room.reviewsCount || 12} Verified Reviews)</span>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '440px' }}>
              <img
                src={room.images?.[activeImage] || room.images?.[0]}
                alt={room.title}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-lg-4 d-flex flex-lg-column gap-3 overflow-auto">
            {room.images?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`rounded-3 overflow-hidden border cursor-pointer ${
                  activeImage === idx ? 'border-primary border-3' : 'border-light-subtle'
                }`}
                style={{ height: '135px', cursor: 'pointer', flex: '1 0 120px' }}
              >
                <img src={img} alt="Preview" className="w-100 h-100 object-fit-cover" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Description & Booking Widget */}
        <div className="row g-5">
          {/* Left Column: Specifications & Amenities */}
          <div className="col-lg-8">
            {/* Key Specifications Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark font-heading mb-4">Room Overview & Dimensions</h5>
              <div className="row g-3 text-center">
                <div className="col-sm-3 col-6">
                  <div className="p-3 bg-light rounded-3">
                    <Users size={22} className="text-primary mb-2" />
                    <span className="d-block text-muted small">Max Capacity</span>
                    <strong className="text-dark">{room.capacity?.adults} Adults, {room.capacity?.children || 0} Kids</strong>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="p-3 bg-light rounded-3">
                    <Bed size={22} className="text-primary mb-2" />
                    <span className="d-block text-muted small">Bedding</span>
                    <strong className="text-dark">{room.bedType || 'King Bed'}</strong>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="p-3 bg-light rounded-3">
                    <Square size={22} className="text-primary mb-2" />
                    <span className="d-block text-muted small">Total Area</span>
                    <strong className="text-dark">{room.sizeSqFt || 400} Sq Ft</strong>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="p-3 bg-light rounded-3">
                    <Clock size={22} className="text-primary mb-2" />
                    <span className="d-block text-muted small">Floor Level</span>
                    <strong className="text-dark">Floor {room.floor || 1}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark font-heading mb-3">About this Residence</h5>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.8', fontSize: '1rem' }}>
                {room.description}
              </p>
            </div>

            {/* Amenities List */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark font-heading mb-4">Suite Amenities & Perks</h5>
              <div className="row g-3">
                {room.amenities?.map((amenity, i) => (
                  <div key={i} className="col-md-6">
                    <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3 border border-light-subtle">
                      <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                      <span className="text-dark fw-medium small">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Policies Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark font-heading mb-3">Check-in & Stay Policies</h5>
              <div className="row g-3 text-secondary small" style={{ lineHeight: '1.7' }}>
                <div className="col-sm-6">
                  <p className="mb-1"><strong>Check-In Time:</strong> 3:00 PM onwards</p>
                  <p className="mb-0"><strong>Check-Out Time:</strong> 11:00 AM</p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-1"><strong>Cancellation:</strong> 100% refund up to 24 hours prior</p>
                  <p className="mb-0"><strong>Identification:</strong> Valid passport or state ID required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Direct Reservation Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <span className="text-muted small">Nightly Rate</span>
                <div>
                  <span className="fs-2 fw-bold text-primary font-heading">${room.pricePerNight}</span>
                  <span className="text-muted small"> / night</span>
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex align-items-center gap-2 text-success fw-semibold small mb-1">
                  <ShieldCheck size={16} /> Best Rate Guarantee
                </div>
                <div className="text-muted small">
                  Instant confirmation • No hidden booking charges
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                disabled={!isAvailable}
                className={`btn w-100 py-3 rounded-3 fw-bold fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2 ${
                  isAvailable ? 'hp-btn-primary' : 'btn-secondary text-white'
                }`}
              >
                <Sparkles size={18} />
                {isAvailable ? 'Reserve This Room' : 'Currently Unavailable'}
              </button>

              <hr className="my-4" />

              <div className="text-center text-secondary small">
                <p className="mb-1">Need special arrangements or corporate booking?</p>
                <span className="text-primary fw-semibold">Call Concierge: +1 (800) 555-HOTELPRO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          room={room}
        />
      )}
    </div>
  );
};

export default RoomDetails;
