import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { Users, Search, Shield, Crown, Mail, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';

const ManageGuests = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s) ||
      u.idProofNumber?.toLowerCase().includes(s);

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Guest CRM & Accounts
          </span>
          <h2 className="fw-bold font-heading text-dark mb-1">Guest & Staff Directory</h2>
          <p className="text-muted small mb-0">Manage customer records, identification proof verification, and VIP hospitality status.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search guest name, email, phone, or ID proof #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end flex-wrap">
            {['All', 'guest', 'staff', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold text-capitalize ${
                  roleFilter === role
                    ? 'btn-primary text-white shadow-sm'
                    : 'btn-light text-secondary'
                }`}
              >
                {role === 'All' ? 'All Accounts' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Records Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>Profile & Name</th>
                <th>Role & Status</th>
                <th>Contact Information</th>
                <th>ID Proof Record</th>
                <th>Address</th>
                <th>Member Since</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No directory records found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={u.name}
                          className="rounded-circle border"
                          style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="text-dark d-block small">{u.name}</strong>
                          <span className="text-muted small">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <span
                          className={`badge rounded-pill text-uppercase px-2.5 py-1 ${
                            u.role === 'admin'
                              ? 'bg-danger text-white'
                              : u.role === 'staff'
                              ? 'bg-info text-dark'
                              : 'bg-primary-subtle text-primary'
                          }`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {u.role}
                        </span>
                        {u.vipStatus && (
                          <span className="badge bg-warning text-dark rounded-pill px-2 py-0.5" title="VIP Guest">
                            <Crown size={11} className="me-1" /> VIP
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="small text-secondary">
                      <div><Phone size={13} className="me-1 text-primary" /> {u.phone || 'No phone'}</div>
                      <div className="text-muted"><Mail size={13} className="me-1" /> {u.email}</div>
                    </td>

                    <td className="small text-secondary">
                      {u.idProofType ? (
                        <div>
                          <span className="badge bg-light text-dark border me-1">{u.idProofType}</span>
                          <span className="font-monospace text-muted">{u.idProofNumber || 'On file'}</span>
                        </div>
                      ) : (
                        <span className="text-muted fst-italic">Pending at check-in</span>
                      )}
                    </td>

                    <td className="small text-secondary text-truncate" style={{ maxWidth: '180px' }}>
                      {u.address || '—'}
                    </td>

                    <td className="small text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageGuests;
