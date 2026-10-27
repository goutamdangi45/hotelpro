import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, Square, Star, Sparkles, CheckCircle2 } from 'lucide-react';

const RoomCard = ({ room, onBookNow }) => {
  const isAvailable = room.status === 'Available';

  const statusBadge = () => {
    switch (room.status) {
      case 'Available':
        return <span className="badge hp-badge-available px-3 py-1 rounded-pill">Available</span>;
      case 'Occupied':
        return <span className="badge hp-badge-occupied px-3 py-1 rounded-pill">Occupied</span>;
      case 'Maintenance':
        return <span className="badge hp-badge-maintenance px-3 py-1 rounded-pill">Maintenance</span>;
      default:
        return <span className="badge bg-secondary px-3 py-1 rounded-pill">{room.status}</span>;
    }
  };

  return (
    <div className="card hp-card h-100">
      {/* Room Image Container */}
      <div className="position-relative overflow-hidden" style={{ height: '230px' }}>
        <img
          src={
            room.images && room.images.length > 0
              ? room.images[0]
              : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
          }
          alt={room.title}
          className="w-100 h-100 object-fit-cover transition-transform"
          style={{ objectFit: 'cover' }}
        />
        {/* Badges on Image */}
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge bg-dark bg-opacity-75 text-white backdrop-blur px-2.5 py-1.5 rounded-pill">
            Room {room.roomNumber}
          </span>
          <span className="badge bg-primary text-white px-2.5 py-1.5 rounded-pill">
            {room.roomType}
          </span>
        </div>
        <div className="position-absolute top-0 end-0 m-3">
          {statusBadge()}
        </div>
        <div className="position-absolute bottom-0 start-0 m-3">
          <div className="d-flex align-items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-pill shadow-sm">
            <Star size={14} className="text-warning fill-warning" fill="#f59e0b" />
            <span className="fw-bold small text-dark">{room.rating || 4.9}</span>
            <span className="text-muted small">({room.reviewsCount || 10})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column">
        <h5 className="card-title fw-bold text-dark font-heading mb-2 line-clamp-1">
          {room.title}
        </h5>
        <p className="card-text text-muted small line-clamp-2 mb-3" style={{ lineHeight: '1.6' }}>
          {room.description}
        </p>

        {/* Room Specifications Row */}
        <div className="d-flex align-items-center justify-content-between py-2 border-top border-bottom border-light-subtle my-2 text-secondary small">
          <div className="d-flex align-items-center gap-1" title="Max Guests">
            <Users size={16} className="text-primary" />
            <span>{room.capacity?.adults || 2} Adults</span>
          </div>
          <div className="d-flex align-items-center gap-1" title="Bed Type">
            <Bed size={16} className="text-primary" />
            <span>{room.bedType || 'King Bed'}</span>
          </div>
          <div className="d-flex align-items-center gap-1" title="Room Size">
            <Square size={16} className="text-primary" />
            <span>{room.sizeSqFt || 400} sq ft</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="d-flex flex-wrap gap-1 my-2">
          {room.amenities?.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="badge bg-light text-secondary border border-light-subtle rounded-pill fw-normal px-2 py-1"
              style={{ fontSize: '0.72rem' }}
            >
              <CheckCircle2 size={10} className="me-1 text-success" />
              {amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="badge bg-light text-muted border border-light-subtle rounded-pill fw-normal px-2 py-1" style={{ fontSize: '0.72rem' }}>
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer Pricing & Actions */}
        <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-light-subtle">
          <div>
            <span className="text-muted small d-block">Starting from</span>
            <span className="fs-4 fw-bold text-primary font-heading">${room.pricePerNight}</span>
            <span className="text-muted small"> / night</span>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/rooms/${room._id}`} className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-3 fw-semibold">
              Details
            </Link>
            <button
              onClick={() => onBookNow && onBookNow(room)}
              disabled={!isAvailable}
              className={`btn btn-sm px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-1 ${
                isAvailable ? 'hp-btn-primary' : 'btn-secondary text-white'
              }`}
            >
              {isAvailable ? (
                <>
                  <Sparkles size={14} />
                  Book
                </>
              ) : (
                'Unavailable'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
