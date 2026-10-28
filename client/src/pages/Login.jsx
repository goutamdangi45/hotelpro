import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, LogIn, Sparkles, Shield, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin' || res.user.role === 'staff') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } else {
      setError(res.message);
    }
  };

  // Quick 1-click demo login filler & instant auto-login
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    const res = await login(demoEmail, demoPassword);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin' || res.user.role === 'staff') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="bg-primary text-white rounded-3 p-3 d-inline-flex align-items-center justify-content-center shadow-sm mb-3"
                  style={{ width: '54px', height: '54px' }}
                >
                  <Building2 size={30} />
                </div>
                <h3 className="fw-bold font-heading text-dark mb-1">Welcome Back</h3>
                <p className="text-muted small">Access your HotelPro account and reservations</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2.5 rounded-3 mb-4" role="alert">
                  <AlertCircle size={18} />
                  <span className="small">{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="e.g. guest@hotelpro.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-secondary mb-0">Password</label>
                    <span className="text-primary small cursor-pointer">Default: password123</span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="hp-btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm mb-4"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Quick Demo Login Profiles */}
              <div className="p-3 bg-light rounded-3 border mb-4">
                <span className="d-block text-center text-muted fw-bold small text-uppercase tracking-wider mb-2" style={{ fontSize: '0.7rem' }}>
                  Quick Demo Accounts (1-Click)
                </span>
                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@hotelpro.com', 'password123')}
                    className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-between py-1.5 px-3 rounded-pill"
                  >
                    <span className="d-flex align-items-center gap-1.5">
                      <Shield size={14} /> <strong>Admin</strong> (Full System Control)
                    </span>
                    <span className="badge bg-danger">Fill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('staff@hotelpro.com', 'password123')}
                    className="btn btn-sm btn-outline-info d-flex align-items-center justify-content-between py-1.5 px-3 rounded-pill text-dark"
                  >
                    <span className="d-flex align-items-center gap-1.5">
                      <UserCheck size={14} /> <strong>Staff Desk</strong> (Check-in/Housekeeping)
                    </span>
                    <span className="badge bg-info text-dark">Fill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('guest@hotelpro.com', 'password123')}
                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-between py-1.5 px-3 rounded-pill"
                  >
                    <span className="d-flex align-items-center gap-1.5">
                      <Sparkles size={14} /> <strong>Guest</strong> (Elena Rostova)
                    </span>
                    <span className="badge bg-primary">Fill</span>
                  </button>
                </div>
              </div>

              {/* Registration Prompt */}
              <div className="text-center text-muted small">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Create Guest Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
