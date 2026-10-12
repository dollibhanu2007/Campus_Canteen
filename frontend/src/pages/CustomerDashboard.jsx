import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  ArrowRight,
  PackageCheck,
  ChefHat,
  Sparkles,
  Calendar
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        if (res.data?.success && res.data.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = orders.filter((o) => ['PLACED', 'PREPARING', 'READY'].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === 'COLLECTED');

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div style={{
          backgroundColor: 'var(--primary-800)',
          color: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ maxWidth: '600px', position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--accent-400)',
              marginBottom: '0.75rem',
            }}>
              <Sparkles size={14} /> Student / Staff Dining Portal
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
              Welcome back, {user?.fullName}!
            </h1>
            <p style={{ color: 'var(--primary-100)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Order your favorite hot meals ahead of your class breaks. Pick up quickly with zero waiting.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-accent btn-sm">
                <UtensilsCrossed size={16} /> Pre-Order Food Now
              </Link>
              <Link to="/orders" className="btn btn-secondary btn-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--white)', borderColor: 'rgba(255,255,255,0.3)' }}>
                View All My Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stat Chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontWeight: '700' }}>ACTIVE ORDERS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--neutral-900)' }}>{activeOrders.length}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PackageCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontWeight: '700' }}>COMPLETED MEALS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--neutral-900)' }}>{completedOrders.length}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontWeight: '700' }}>TOTAL PLACED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--neutral-900)' }}>{orders.length}</div>
            </div>
          </div>
        </div>

        {/* Active Orders Highlight Section */}
        {activeOrders.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="var(--primary-700)" /> Live Active Orders ({activeOrders.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeOrders.map((ord) => (
                <div key={ord.id} className="card" style={{
                  padding: '1.5rem',
                  borderLeft: '5px solid var(--primary-600)',
                  backgroundColor: '#fcfffd',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                          {ord.orderNumber}
                        </span>
                        <StatusBadge status={ord.status} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '0.3rem' }}>
                        Pickup Slot: <strong>{ord.pickupSlot?.startTime?.substring(0, 5)} - {ord.pickupSlot?.endTime?.substring(0, 5)}</strong> on {ord.pickupDate}
                      </div>
                    </div>

                    <Link to={`/orders/track/${ord.id}`} className="btn btn-primary btn-sm">
                      Track Live Timeline <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Menu Preview CTA */}
        <div className="card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Feeling Hungry Today?</h3>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.9rem' }}>
              Check out South Indian meals, hot samosas, paneer grilled sandwiches, filter coffee, and juices.
            </p>
          </div>
          <Link to="/menu" className="btn btn-primary">
            Explore All Food Items <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
