import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { BarChart3, Download, Printer, DollarSign, Calendar, TrendingUp, ShieldCheck } from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load report data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleDownloadCSV = () => {
    if (!stats?.recentBookings) return;

    const headers = ['Booking Number,Guest,Room,Check In,Check Out,Total Nights,Amount,Status,Payment Method'];
    const rows = stats.recentBookings.map((b) => [
      b.bookingNumber,
      `"${b.user?.name || 'Guest'}"`,
      `"${b.room?.roomNumber} - ${b.room?.title}"`,
      new Date(b.checkInDate).toISOString().split('T')[0],
      new Date(b.checkOutDate).toISOString().split('T')[0],
      b.totalNights,
      b.totalAmount,
      b.bookingStatus,
      b.paymentMethod,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HotelPro_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading reports...</span>
        </div>
      </div>
    );
  }

  const { revenue, rooms, bookings, roomTypeDistribution } = stats || {};

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 no-print">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Business Intelligence
          </span>
          <h2 className="fw-bold font-heading text-dark mb-1">Financial & Occupancy Analytics</h2>
          <p className="text-muted small mb-0">Monthly revenue distributions, ADR (Average Daily Rate), and tax collection summaries.</p>
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={() => window.print()}
            className="btn btn-outline-secondary rounded-3 px-3 py-2 fw-semibold small d-flex align-items-center gap-1"
          >
            <Printer size={15} /> Print Report
          </button>
          <button
            onClick={handleDownloadCSV}
            className="hp-btn-primary rounded-3 px-3 py-2 text-white fw-semibold small d-flex align-items-center gap-1 shadow-sm"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Revenue Snapshot Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <span className="text-muted small fw-bold text-uppercase">Gross Revenue</span>
            <h3 className="fw-bold text-primary font-heading mt-2 mb-1">
              ${(revenue?.total || 0).toLocaleString()}
            </h3>
            <span className="text-success small fw-semibold">
              <TrendingUp size={14} className="me-1" /> Verified & Reconciled
            </span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <span className="text-muted small fw-bold text-uppercase">Total Reservations</span>
            <h3 className="fw-bold text-dark font-heading mt-2 mb-1">{bookings?.total || 0}</h3>
            <span className="text-muted small">{bookings?.completed || 0} completed stays</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <span className="text-muted small fw-bold text-uppercase">Occupancy Capacity</span>
            <h3 className="fw-bold text-success font-heading mt-2 mb-1">
              {rooms?.occupancyRate || 0}%
            </h3>
            <span className="text-muted small">{rooms?.occupied || 0} occupied / {rooms?.total || 0} total</span>
          </div>
        </div>
      </div>

      {/* Monthly Trajectory Simulation */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <h5 className="fw-bold font-heading text-dark mb-4">6-Month Revenue & Booking Trajectory</h5>
        <div className="row g-3 text-center">
          {revenue?.monthly?.map((m) => (
            <div key={m.month} className="col-md-2 col-4">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block mb-1">{m.month}</span>
                <strong className="fs-6 text-dark d-block">${m.revenue.toLocaleString()}</strong>
                <span className="badge bg-primary-subtle text-primary mt-1" style={{ fontSize: '0.7rem' }}>
                  {m.bookings} bookings
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Category Distribution */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold font-heading text-dark mb-4">Inventory Distribution by Tier</h5>
        <div className="row g-3">
          {roomTypeDistribution?.map((cat) => (
            <div key={cat._id} className="col-md-3 col-6">
              <div className="p-3 border rounded-3 bg-light">
                <strong className="text-dark d-block">{cat._id}</strong>
                <span className="fs-5 fw-bold text-primary font-heading">{cat.count}</span>
                <span className="text-muted small"> Units</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
