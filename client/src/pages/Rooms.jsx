import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  Users,
  Sparkles,
  BedDouble,
} from 'lucide-react';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000');
  const [adults, setAdults] = useState(searchParams.get('adults') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('price-asc');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roomType && roomType !== 'All') params.roomType = roomType;
      if (status && status !== 'All') params.status = status;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (adults) params.adults = adults;
      if (sort) params.sort = sort;
      if (checkIn && checkOut) {
        params.checkIn = checkIn;
        params.checkOut = checkOut;
      }

      const res = await api.get('/rooms', { params });
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [roomType, status, sort, maxPrice]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoomType('All');
    setMinPrice('');
    setMaxPrice('1000');
    setAdults('');
    setStatus('All');
    setSort('price-asc');
    setCheckIn('');
    setCheckOut('');
    setSearchParams({});
  };

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const roomTypesList = [
    'All',
    'Deluxe',
    'Executive Suite',
    'Presidential Suite',
    'Family Suite',
    'Single',
  ];

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
            Curated Hotel Inventory
          </span>
          <h1 className="fw-bold display-5 font-heading text-dark mb-2">
            Explore Rooms & Suites
          </h1>
          <p className="text-muted">
            Find the perfect accommodations with real-time availability and guaranteed best rates.
          </p>
        </div>

        {/* Room Type Pills Filter Bar */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {roomTypesList.map((type) => (
            <button
              key={type}
              onClick={() => setRoomType(type)}
              className={`btn rounded-pill px-4 py-2 fw-semibold transition-all ${
                roomType === type
                  ? 'btn-primary text-white shadow-sm'
                  : 'btn-white bg-white border text-secondary'
              }`}
            >
              {type === 'All' ? 'All Accommodations' : type}
            </button>
          ))}
        </div>

        {/* Main Content Layout (Sidebar Filters + Room Grid) */}
        <div className="row g-4">
          {/* Left Column: Filter Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" />
                  <h6 className="fw-bold mb-0 text-dark">Filter Results</h6>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-sm btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              <form onSubmit={handleApplyFilters}>
                {/* Search Keyword */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Search Keyword</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Ocean, Jacuzzi..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-secondary mb-0">Max Price / Night</label>
                    <span className="fw-bold text-primary">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="100"
                    max="1000"
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <div className="d-flex justify-content-between text-muted small">
                    <span>$100</span>
                    <span>$1000+</span>
                  </div>
                </div>

                {/* Dates Availability */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Check-In</label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Check-Out</label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                {/* Minimum Guests */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Guests (Adults)</label>
                  <select
                    className="form-select rounded-3"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                  >
                    <option value="">Any Capacity</option>
                    <option value="1">1+ Guest</option>
                    <option value="2">2+ Guests</option>
                    <option value="3">3+ Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Availability Status</label>
                  <select
                    className="form-select rounded-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available for Booking</option>
                    <option value="Occupied">Currently Occupied</option>
                  </select>
                </div>

                <button type="submit" className="hp-btn-primary w-100 py-2.5 rounded-3 fw-bold shadow-sm">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Room Catalog */}
          <div className="col-lg-9">
            {/* Header info & Sort dropdown */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm">
              <span className="text-secondary small fw-medium">
                Showing <strong className="text-dark">{rooms.length}</strong> luxurious accommodations
              </span>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small d-none d-sm-inline">Sort By:</span>
                <select
                  className="form-select form-select-sm rounded-3 border-light-subtle"
                  style={{ width: '170px' }}
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="roomNumber">Room Number</option>
                </select>
              </div>
            </div>

            {/* Room Cards Grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading rooms...</span>
                </div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <div className="p-3 bg-light rounded-circle mx-auto mb-3" style={{ width: 'fit-content' }}>
                  <Search size={32} className="text-muted" />
                </div>
                <h4 className="fw-bold text-dark font-heading">No Accommodations Found</h4>
                <p className="text-muted mb-4">
                  We couldn't find any rooms matching your selected criteria. Try adjusting your filters.
                </p>
                <div>
                  <button onClick={handleResetFilters} className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold">
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {rooms.map((room) => (
                  <div key={room._id} className="col-md-6">
                    <RoomCard room={room} onBookNow={handleBookNow} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          room={selectedRoom}
          initialDates={{ checkIn, checkOut }}
        />
      )}
    </div>
  );
};

export default Rooms;
