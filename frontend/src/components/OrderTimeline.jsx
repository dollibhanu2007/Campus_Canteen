import React from 'react';
import { Clock, ChefHat, CheckCircle2, PackageCheck, XCircle } from 'lucide-react';

const OrderTimeline = ({ status }) => {
  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received by canteen kitchen', icon: Clock },
    { key: 'PREPARING', label: 'Preparing', desc: 'Fresh food being cooked', icon: ChefHat },
    { key: 'READY', label: 'Ready for Pickup', desc: 'At counter with token', icon: CheckCircle2 },
    { key: 'COLLECTED', label: 'Collected', desc: 'Enjoy your meal!', icon: PackageCheck },
  ];

  if (status === 'CANCELLED') {
    return (
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--danger-50)',
        border: '1px solid var(--danger-100)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--danger-600)',
        margin: '1.5rem 0'
      }}>
        <XCircle size={28} />
        <div>
          <div style={{ fontWeight: '700', fontSize: '1rem' }}>Order Cancelled</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
            This order has been cancelled and is no longer being prepared.
          </div>
        </div>
      </div>
    );
  }

  const getStepIndex = (st) => {
    switch (st) {
      case 'PLACED': return 0;
      case 'PREPARING': return 1;
      case 'READY': return 2;
      case 'COLLECTED': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div style={{ margin: '2rem 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        position: 'relative',
        gap: '0.5rem',
      }}>
        {/* Progress connecting line */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '12.5%',
          right: '12.5%',
          height: '4px',
          backgroundColor: 'var(--neutral-200)',
          zIndex: 1,
        }}>
          <div style={{
            height: '100%',
            backgroundColor: 'var(--primary-600)',
            transition: 'width 0.5s ease',
            width: `${(currentIndex / 3) * 100}%`,
          }} />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          let bubbleBg = 'var(--white)';
          let bubbleBorder = '2px solid var(--neutral-300)';
          let iconColor = 'var(--neutral-400)';

          if (isCompleted) {
            bubbleBg = 'var(--primary-600)';
            bubbleBorder = '2px solid var(--primary-600)';
            iconColor = 'var(--white)';
          } else if (isCurrent) {
            bubbleBg = 'var(--primary-50)';
            bubbleBorder = '2px solid var(--primary-600)';
            iconColor = 'var(--primary-700)';
          }

          return (
            <div key={step.key} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: bubbleBg,
                border: bubbleBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor,
                boxShadow: isCurrent ? '0 0 0 4px var(--primary-100)' : 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
              }}>
                <Icon size={22} />
              </div>
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: isCurrent ? '700' : '600',
                color: isCurrent ? 'var(--primary-800)' : isCompleted ? 'var(--neutral-800)' : 'var(--neutral-400)',
              }}>
                {step.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--neutral-500)',
                marginTop: '0.15rem',
                display: 'none',
              }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
