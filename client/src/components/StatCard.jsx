import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', badgeText }) => {
  const colorMap = {
    primary: { bg: 'bg-primary-subtle', text: 'text-primary', border: 'border-primary-subtle' },
    success: { bg: 'bg-success-subtle', text: 'text-success', border: 'border-success-subtle' },
    warning: { bg: 'bg-warning-subtle', text: 'text-warning-emphasis', border: 'border-warning-subtle' },
    info: { bg: 'bg-info-subtle', text: 'text-info', border: 'border-info-subtle' },
    danger: { bg: 'bg-danger-subtle', text: 'text-danger', border: 'border-danger-subtle' },
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
      <div className="card-body p-1">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-muted fw-medium text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
            {title}
          </span>
          <div className={`p-2 rounded-3 ${scheme.bg} ${scheme.text} d-flex align-items-center justify-content-center`}>
            {Icon && <Icon size={20} />}
          </div>
        </div>
        <div className="d-flex align-items-baseline justify-content-between">
          <h3 className="fw-bold mb-0 text-dark">{value}</h3>
          {badgeText && (
            <span className={`badge ${scheme.bg} ${scheme.text} border ${scheme.border} px-2 py-1 rounded-pill`} style={{ fontSize: '0.75rem' }}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="text-muted small mt-2 mb-0">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
