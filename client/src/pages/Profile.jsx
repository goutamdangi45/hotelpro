import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Crown,
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [idProofType, setIdProofType] = useState(user?.idProofType || 'Passport');
  const [idProofNumber, setIdProofNumber] = useState(user?.idProofNumber || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusMessage({ type: '', text: '' });

    const res = await updateProfile({
      name,
      phone,
      address,
      avatar,
      idProofType,
      idProofNumber,
    });

    setSavingProfile(false);
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' });
    } else {
      setStatusMessage({ type: 'danger', text: res.message });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'danger', text: 'Password must be at least 6 characters' });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2">
            Account Management
          </span>
          <h1 className="fw-bold font-heading display-6 text-dark mb-1">
            Guest Profile & Security
          </h1>
          <p className="text-muted mb-0">Manage your identity documents, contact information, and security credentials.</p>
        </div>

        <div className="row g-4">
          {/* Left Column: Avatar & Overview */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center mb-4">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="rounded-circle border border-3 border-primary shadow-sm"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                {user?.vipStatus && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-warning text-dark p-1.5 rounded-circle shadow-sm"
                    title="VIP Guest"
                  >
                    <Crown size={16} />
                  </span>
                )}
              </div>

              <h4 className="fw-bold text-dark font-heading mb-1">{user?.name}</h4>
              <p className="text-muted small mb-2">{user?.email}</p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-primary text-uppercase px-3 py-1 rounded-pill">
                  {user?.role}
                </span>
                {user?.vipStatus && (
                  <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-3 py-1 rounded-pill">
                    VIP Member
                  </span>
                )}
              </div>

              <div className="p-3 bg-light rounded-3 text-start small border">
                <div className="d-flex align-items-center gap-2 text-secondary mb-1">
                  <ShieldCheck size={16} className="text-success" />
                  <span>ID Verification on Record</span>
                </div>
                <div className="text-muted">
                  {user?.idProofType || 'Passport'}: {user?.idProofNumber || 'Registered'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Update Forms */}
          <div className="col-lg-8">
            {/* General Profile Info Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold font-heading text-dark mb-3">Personal & Contact Details</h5>

              {statusMessage.text && (
                <div className={`alert alert-${statusMessage.type} rounded-3 py-2.5 small`} role="alert">
                  {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">Full Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control rounded-3"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Residential / Billing Address</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, State, ZIP, Country"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">Document / ID Proof Type</label>
                    <select
                      className="form-select rounded-3"
                      value={idProofType}
                      onChange={(e) => setIdProofType(e.target.value)}
                    >
                      <option value="Passport">Passport</option>
                      <option value="National ID">National ID Card</option>
                      <option value="Drivers License">Driver's License</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">ID Number</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={idProofNumber}
                      onChange={(e) => setIdProofNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Profile Image URL</label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="hp-btn-primary px-4 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                >
                  <Save size={16} />
                  {savingProfile ? 'Saving...' : 'Update Information'}
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold font-heading text-dark mb-3">Change Account Password</h5>

              {passwordMessage.text && (
                <div className={`alert alert-${passwordMessage.type} rounded-3 py-2.5 small`} role="alert">
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Current Password</label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">New Password</label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="btn btn-outline-primary px-4 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <Lock size={16} />
                  {savingPassword ? 'Changing...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
