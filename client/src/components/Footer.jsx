import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center">
                <Building2 size={24} />
              </div>
              <h4 className="mb-0 fw-bold text-white font-heading">HotelPro</h4>
            </div>
            <p className="text-secondary mb-3" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
              Your ultimate hotel management solution. Streamlining hotel operations with a secure,
              scalable backend, ensuring efficient booking, guest management, and payment processing.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                <ShieldCheck size={14} className="me-1 mb-1" /> Enterprise Certified
              </span>
              <span className="badge bg-secondary-subtle text-light border border-secondary-subtle px-3 py-2 rounded-pill">
                24/7 Concierge
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase text-light fw-bold mb-3 tracking-wider" style={{ fontSize: '0.85rem' }}>
              Navigation
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary" style={{ fontSize: '0.9rem' }}>
              <li>
                <Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link>
              </li>
              <li>
                <Link to="/rooms" className="text-secondary text-decoration-none hover-white">Rooms & Suites</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-secondary text-decoration-none hover-white">Manage Bookings</Link>
              </li>
              <li>
                <Link to="/admin" className="text-secondary text-decoration-none hover-white">Staff Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Room Categories */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-uppercase text-light fw-bold mb-3 tracking-wider" style={{ fontSize: '0.85rem' }}>
              Accommodation
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary" style={{ fontSize: '0.9rem' }}>
              <li>Presidential Suites</li>
              <li>Executive Oceanfront</li>
              <li>Deluxe King Rooms</li>
              <li>Family Luxury Cottages</li>
              <li>Single Business Studios</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase text-light fw-bold mb-3 tracking-wider" style={{ fontSize: '0.85rem' }}>
              Concierge & Desk
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3 text-secondary" style={{ fontSize: '0.9rem' }}>
              <li className="d-flex align-items-center gap-2">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                <span>450 Grand Horizon Blvd, Coastal Bay, CA 90210</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span>+1 (800) 555-HOTELPRO</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span>reservations@hotelpro.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-secondary" style={{ fontSize: '0.875rem' }}>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} HotelPro Management System. All rights reserved.
          </p>
          <div className="d-flex align-items-center gap-1">
            <span>Built for modern hospitality excellence</span>
            <Heart size={14} className="text-danger ms-1" fill="#dc3545" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
