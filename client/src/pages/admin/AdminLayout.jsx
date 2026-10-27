import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  Sparkles,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Building2,
  Wrench,
} from 'lucide-react';

const AdminLayout = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/rooms', label: 'Room Inventory', icon: BedDouble },
    { to: '/admin/bookings', label: 'Front Desk & Bookings', icon: CalendarCheck },
    { to: '/admin/guests', label: 'Guest Directory', icon: Users },
    { to: '/admin/housekeeping', label: 'Housekeeping & Maint.', icon: Wrench },
    { to: '/admin/reports', label: 'Revenue & Reports', icon: BarChart3 },
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Top Banner for Admin Mode */}
      <div className="bg-dark text-white py-2 px-4 d-flex justify-content-between align-items-center small">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-danger text-uppercase px-2 py-1">HotelPro Operations</span>
          <span className="text-white-50">Active Operator: <strong>{user?.name}</strong> ({user?.role})</span>
        </div>
        <Link to="/" className="text-white-50 text-decoration-none hover-white d-flex align-items-center gap-1">
          <span>Return to Guest View</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="container-fluid py-4 px-lg-5">
        <div className="row g-4">
          {/* Admin Navigation Sidebar */}
          <div className="col-lg-3 col-xl-2">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white sticky-top" style={{ top: '85px' }}>
              <div className="d-flex align-items-center gap-2 px-2 py-3 mb-2 border-bottom">
                <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0 font-heading">HotelPro Desk</h6>
                  <span className="text-muted small">Property PMS</span>
                </div>
              </div>

              <div className="nav flex-column gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => `hp-admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span className="small">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-3 bg-light rounded-3 mt-4 text-center small border">
                <ShieldCheck size={18} className="text-success mb-1" />
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                  Secure Encrypted Session
                </p>
              </div>
            </div>
          </div>

          {/* Main Outlet Area */}
          <div className="col-lg-9 col-xl-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
