import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import StatCard from '../../components/StatCard';
import InvoiceModal from '../../components/InvoiceModal';
import {
  BedDouble,
  DollarSign,
  CalendarCheck,
  Percent,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Wrench,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading metrics...</span>
        </div>
      </div>
    );
  }

  const { rooms, bookings, revenue, housekeeping, recentBookings, monthlyRevenue } = stats || {};

  return (
    <div>
      {/* Top Welcome & Summary Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Operations & Analytics Center
          </span>
          <h2 className="fw-bold font-heading text-dark mb-1">Hospitality Performance Overview</h2>
          <p className="text-muted small mb-0">Real-time room occupancy, revenue flow, and guest movements.</p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/bookings" className="btn btn-outline-primary rounded-3 px-3 py-2 fw-semibold small">
            Front Desk Actions
          </Link>
          <Link to="/admin/rooms" className="hp-btn-primary rounded-3 px-3 py-2 text-white fw-semibold small">
            Manage Inventory
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Total Revenue Settled"
            value={`$${(revenue?.total || 0).toLocaleString()}`}
            subtitle="Including 12% lodging tax"
            icon={DollarSign}
            color="success"
            badgeText="+14.2% MoM"
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Occupancy Rate"
            value={`${rooms?.occupancyRate || 0}%`}
            subtitle={`${rooms?.occupied || 0} of ${rooms?.total || 0} rooms occupied`}
            icon={Percent}
            color="primary"
            badgeText={rooms?.occupancyRate > 70 ? 'High Demand' : 'Optimal'}
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Active Reservations"
            value={bookings?.active || 0}
            subtitle={`${bookings?.confirmed || 0} confirmed, ${bookings?.checkedIn || 0} in-house`}
            icon={CalendarCheck}
            color="info"
            badgeText="Active Stays"
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Housekeeping Tasks"
            value={housekeeping?.pendingTasks || 0}
            subtitle="Requires sanitation / inspection"
            icon={Wrench}
            color="warning"
            badgeText="Pending"
          />
        </div>
      </div>

      {/* Today's Movement & Room Inventory Snapshot */}
      <div className="row g-4 mb-4">
        {/* Today's Turnaround Box */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold font-heading text-dark mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-primary" /> Today's Front Desk Movements
            </h5>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border text-center">
                  <span className="text-muted small d-block">Expected Arrivals</span>
                  <span className="fs-3 fw-bold text-success">{bookings?.todayCheckIns || 0}</span>
                  <span className="d-block text-muted small">Check-ins today</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3 border text-center">
                  <span className="text-muted small d-block">Expected Departures</span>
                  <span className="fs-3 fw-bold text-danger">{bookings?.todayCheckOuts || 0}</span>
                  <span className="d-block text-muted small">Check-outs today</span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center p-3 bg-primary-subtle rounded-3 text-primary small">
              <div className="d-flex align-items-center gap-2">
                <UserCheck size={18} />
                <span>Need fast check-in for arriving guests?</span>
              </div>
              <Link to="/admin/bookings" className="fw-bold text-primary text-decoration-none">
                Open Front Desk →
              </Link>
            </div>
          </div>
        </div>

        {/* Room Status Distribution */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold font-heading text-dark mb-3 d-flex align-items-center gap-2">
              <BedDouble size={18} className="text-primary" /> Inventory Status Breakdown
            </h5>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small fw-semibold text-secondary mb-1">
                  <span>Available for Booking</span>
                  <span className="text-success">{rooms?.available || 0} Rooms</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(rooms?.available / (rooms?.total || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small fw-semibold text-secondary mb-1">
                  <span>Occupied / In-House</span>
                  <span className="text-primary">{rooms?.occupied || 0} Rooms</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${(rooms?.occupied / (rooms?.total || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small fw-semibold text-secondary mb-1">
                  <span>Maintenance / Cleaning</span>
                  <span className="text-danger">{rooms?.maintenance || 0} Rooms</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${(rooms?.maintenance / (rooms?.total || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 border-top text-end">
              <Link to="/admin/rooms" className="text-primary small fw-semibold text-decoration-none">
                View Full Room Roster →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold font-heading text-dark mb-0">Recent Reservations & Activity</h5>
          <Link to="/admin/bookings" className="btn btn-sm btn-outline-primary rounded-pill px-3">
            View All Bookings
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light text-secondary small">
              <tr>
                <th>Booking #</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings?.map((b) => (
                <tr key={b._id}>
                  <td>
                    <span className="font-monospace fw-bold text-dark">{b.bookingNumber}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={b.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={b.user?.name}
                        className="rounded-circle"
                        style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong className="text-dark d-block small">{b.user?.name || 'Guest'}</strong>
                        <span className="text-muted small">{b.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border me-1">
                      Room {b.room?.roomNumber}
                    </span>
                    <span className="small text-muted">{b.room?.roomType}</span>
                  </td>
                  <td className="small text-secondary">
                    {new Date(b.checkInDate).toLocaleDateString()} →{' '}
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td>
                    <strong className="text-primary">${b.totalAmount?.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-2.5 py-1 ${
                        b.bookingStatus === 'Confirmed'
                          ? 'bg-success-subtle text-success'
                          : b.bookingStatus === 'Checked-In'
                          ? 'bg-primary-subtle text-primary'
                          : b.bookingStatus === 'Cancelled'
                          ? 'bg-danger-subtle text-danger'
                          : 'bg-secondary-subtle text-secondary'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => {
                        setSelectedBookingForInvoice(b);
                        setShowInvoiceModal(true);
                      }}
                      className="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-secondary"
                      title="View Invoice"
                    >
                      <FileText size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedBookingForInvoice && (
        <InvoiceModal
          show={showInvoiceModal}
          onHide={() => setShowInvoiceModal(false)}
          booking={selectedBookingForInvoice}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
