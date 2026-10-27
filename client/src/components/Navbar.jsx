import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  CalendarCheck,
  LayoutDashboard,
  User,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg hp-navbar sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3 p-2 shadow-sm"
            style={{ width: '42px', height: '42px' }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <span className="fw-bolder fs-4 tracking-tight text-dark">Hotel</span>
            <span className="fw-bolder fs-4 text-primary">Pro</span>
            <span className="badge bg-warning text-dark ms-2 fw-semibold px-2 py-1" style={{ fontSize: '0.65rem' }}>
              LUXURY
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hotelproNavbar"
          aria-controls="hotelproNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="hotelproNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Rooms & Suites
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <CalendarCheck size={16} className="me-1 mb-1" />
                  My Reservations
                </NavLink>
              </li>
            )}
            {isStaff && (
              <li className="nav-item">
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-primary fw-semibold`}>
                  <LayoutDashboard size={16} className="me-1 mb-1" />
                  Staff Desk
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action / Auth Buttons */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 border px-3 py-2 rounded-pill shadow-sm dropdown-toggle"
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="rounded-circle border"
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                  />
                  <div className="text-start d-none d-sm-block">
                    <span className="fw-semibold d-block text-truncate" style={{ maxWidth: '120px', fontSize: '0.875rem' }}>
                      {user?.name}
                    </span>
                  </div>
                  <span
                    className={`badge rounded-pill ms-1 text-uppercase ${
                      isAdmin ? 'bg-danger text-white' : isStaff ? 'bg-info text-dark' : 'bg-primary-subtle text-primary'
                    }`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2 mt-2" aria-labelledby="userMenuButton" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold text-dark">{user?.name}</p>
                    <small className="text-muted">{user?.email}</small>
                  </li>
                  {isStaff && (
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/admin">
                        <LayoutDashboard size={16} className="text-primary" />
                        Management Console
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/my-bookings">
                      <CalendarCheck size={16} className="text-success" />
                      My Reservations
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                      <User size={16} className="text-secondary" />
                      Profile & Identification
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item py-2 text-danger d-flex align-items-center gap-2">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-secondary px-3 py-2 rounded-3 fw-semibold">
                  Sign In
                </Link>
                <Link to="/rooms" className="hp-btn-primary px-3 py-2 text-white rounded-3 shadow-sm d-flex align-items-center gap-1">
                  <Sparkles size={16} />
                  Book Room
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
