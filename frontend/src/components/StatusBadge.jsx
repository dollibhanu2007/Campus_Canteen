import React from 'react';
import { Clock, ChefHat, CheckCircle2, PackageCheck, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PLACED':
        return {
          label: 'Order Placed',
          className: 'badge-placed',
          icon: <Clock size={13} />,
        };
      case 'PREPARING':
        return {
          label: 'Preparing',
          className: 'badge-preparing',
          icon: <ChefHat size={13} />,
        };
      case 'READY':
        return {
          label: 'Ready for Pickup',
          className: 'badge-ready',
          icon: <CheckCircle2 size={13} />,
        };
      case 'COLLECTED':
        return {
          label: 'Collected',
          className: 'badge-collected',
          icon: <PackageCheck size={13} />,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'badge-cancelled',
          icon: <XCircle size={13} />,
        };
      default:
        return {
          label: status || 'Unknown',
          className: 'badge-collected',
          icon: null,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
