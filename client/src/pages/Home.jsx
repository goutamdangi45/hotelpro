import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  Calendar,
  Users,
  Search,
  ShieldCheck,
  CreditCard,
  Sparkles,
  BedDouble,
  Coffee,
  Waves,
  Wifi,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Search widget state
  const formatDate = (d) => d.toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(formatDate(new Date()));
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 2);
  const [checkOut, setCheckOut] = useState(formatDate(nextDay));
  const [adults, setAdults] = useState('2');
  const [roomType, setRoomType] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/rooms/featured');
        if (res.data.success) {
          setFeaturedRooms(res.data.rooms);
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (adults) params.append('adults', adults);
    if (roomType && roomType !== 'All') params.append('roomType', roomType);

    navigate(`/rooms?${params.toString()}`);
  };

  const handleBookNow = (room) => {
    setSelectedRoomForBooking(room);
    setShowBookingModal(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <section className="hp-hero text-center py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3 shadow-sm" style={{ letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                <Sparkles size={14} className="me-1 mb-1" />
                World-Class Hospitality Architecture
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3 font-heading" style={{ lineHeight: '1.2' }}>
                Your Ultimate Hotel Management & Luxury Booking Solution
              </h1>
              <p className="lead text-white-50 mb-4" style={{ fontSize: '1.15rem', lineHeight: '1.7' }}>
                Streamlining hotel operations with a secure, scalable backend, ensuring efficient booking,
                guest management, and seamless payment processing.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/rooms" className="hp-btn-gold px-4 py-3 rounded-pill text-white fw-bold shadow-lg d-flex align-items-center gap-2">
                  Explore Rooms & Suites <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline-light px-4 py-3 rounded-pill fw-semibold shadow-sm">
                  Staff & Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Availability Search Widget */}
      <div className="container mb-5">
        <div className="hp-search-bar">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                <Calendar size={14} className="me-1 text-primary" /> Check-In Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg fs-6 rounded-3 border-light-subtle"
                value={checkIn}
                min={formatDate(new Date())}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                <Calendar size={14} className="me-1 text-primary" /> Check-Out Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg fs-6 rounded-3 border-light-subtle"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                <Users size={14} className="me-1 text-primary" /> Guests
              </label>
              <select
                className="form-select form-select-lg fs-6 rounded-3 border-light-subtle"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4+ Adults</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                <BedDouble size={14} className="me-1 text-primary" /> Room Tier
              </label>
              <select
                className="form-select form-select-lg fs-6 rounded-3 border-light-subtle"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Presidential Suite">Presidential</option>
                <option value="Family Suite">Family Suite</option>
                <option value="Single">Single Studio</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-12">
              <button
                type="submit"
                className="hp-btn-primary w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-md fs-6"
              >
                <Search size={18} /> Check Availability
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Rooms Showcase */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="text-primary fw-bold text-uppercase small tracking-widest">
                Curated Luxury
              </span>
              <h2 className="display-6 fw-bold font-heading mb-1 text-dark">
                Featured Accommodations
              </h2>
              <p className="text-muted mb-0">
                Explore our signature residences and award-winning oceanfront suites.
              </p>
            </div>
            <Link to="/rooms" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold">
              View All Rooms ({featuredRooms.length}+)
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading suites...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} onBookNow={handleBookNow} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HotelPro Value Propositions & Core Capabilities */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
              Modern Hospitality Ecosystem
            </span>
            <h2 className="fw-bold font-heading mb-3 text-dark">
              Why Independent Hotels & Chains Trust HotelPro
            </h2>
            <p className="text-muted">
              Built from the ground up for high volume, real-time availability tracking, and bank-grade data security.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-white">
                <div className="bg-primary text-white p-3 rounded-4 mb-3 d-inline-block shadow-sm" style={{ width: 'fit-content' }}>
                  <ShieldCheck size={28} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Secure JWT & Role Auth</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.7' }}>
                  Strict role-based access control protecting Guest profiles, Front Desk operations,
                  and Executive Financial Dashboards with encrypted tokens.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-white">
                <div className="bg-warning text-dark p-3 rounded-4 mb-3 d-inline-block shadow-sm" style={{ width: 'fit-content' }}>
                  <CreditCard size={28} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Instant Invoicing & Payments</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.7' }}>
                  Seamless checkout pipeline featuring automated 12% lodging tax computation,
                  transparent receipts, and digital invoice printing on demand.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-white">
                <div className="bg-success text-white p-3 rounded-4 mb-3 d-inline-block shadow-sm" style={{ width: 'fit-content' }}>
                  <Clock size={28} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Front Desk & Housekeeping</h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.7' }}>
                  Real-time occupancy tracking, 1-click check-in/out, digital key issuance, and live
                  cleanliness state management for hotel staff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Amenities Grid */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="text-primary fw-bold text-uppercase small tracking-widest">
                Signature Amenities
              </span>
              <h2 className="display-6 fw-bold font-heading mb-3 text-dark">
                Elevate Every Moment of Your Journey
              </h2>
              <p className="text-secondary mb-4" style={{ lineHeight: '1.8' }}>
                Whether traveling for business or bespoke leisure, our resort amenities are curated
                to deliver unmatched serenity, wellness, and culinary satisfaction.
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border">
                    <Waves size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Heated Infinity Plunge Pools</h6>
                    <small className="text-muted">Panoramic skyline views and private cabanas</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border">
                    <Coffee size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Artisan Espresso & Dining</h6>
                    <small className="text-muted">Michelin-standard gastronomy and 24/7 in-room dining</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border">
                    <Wifi size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Gigabit Enterprise Wi-Fi</h6>
                    <small className="text-muted">High-bandwidth coverage throughout entire resort grounds</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80"
                    alt="Luxury Hotel Suite"
                    className="img-fluid rounded-4 shadow-sm w-100"
                    style={{ height: '260px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80"
                    alt="Resort Pool"
                    className="img-fluid rounded-4 shadow-sm w-100"
                    style={{ height: '260px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-12">
                  <img
                    src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
                    alt="Hotel Lounge"
                    className="img-fluid rounded-4 shadow-sm w-100"
                    style={{ height: '240px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews / Testimonials */}
      <section className="py-5 bg-light border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase small tracking-widest">
              Guest Experiences
            </span>
            <h2 className="fw-bold font-heading text-dark">Trusted by Travelers Worldwide</h2>
          </div>

          <div className="row g-4">
            {[
              {
                name: 'Lady Victoria Montgomery',
                location: 'London, UK',
                text: 'HotelPro made our check-in seamless. The Presidential Penthouse had breathtaking views and the staff anticipated every single request.',
                rating: 5,
              },
              {
                name: 'Dr. Michael Chen',
                location: 'San Francisco, CA',
                text: 'The fastest online hotel booking experience I have encountered. Instant digital invoice and key card ready upon arrival at the desk.',
                rating: 5,
              },
              {
                name: 'Camila Rodriguez',
                location: 'Madrid, Spain',
                text: 'Unbelievable attention to detail. The family suite accommodated our children comfortably, with spotless housekeeping each afternoon.',
                rating: 5,
              },
            ].map((review, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-white">
                  <div className="d-flex text-warning mb-3">
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} size={16} fill="#f59e0b" className="me-1" />
                    ))}
                  </div>
                  <p className="text-secondary small mb-4 fst-italic" style={{ lineHeight: '1.7' }}>
                    "{review.text}"
                  </p>
                  <div className="mt-auto">
                    <h6 className="fw-bold mb-0 text-dark">{review.name}</h6>
                    <small className="text-muted">{review.location}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedRoomForBooking && (
        <BookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          room={selectedRoomForBooking}
          initialDates={{ checkIn, checkOut }}
        />
      )}
    </div>
  );
};

export default Home;
