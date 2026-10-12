import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      if (res.data?.success && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'ACTIVE') {
      return ['PLACED', 'PREPARING', 'READY'].includes(order.status);
    }
    if (statusFilter === 'COLLECTED') {
      return order.status === 'COLLECTED';
    }
    if (statusFilter === 'CANCELLED') {
      return order.status === 'CANCELLED';
    }
    return true;
  });

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--primary-700)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.35rem',
            }}>
              Customer Account
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>My Orders & Pre-Order History</h1>
          </div>
          <button onClick={fetchOrders} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Orders
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`btn btn-sm ${statusFilter === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Active & Pending ({orders.filter((o) => ['PLACED', 'PREPARING', 'READY'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setStatusFilter('COLLECTED')}
            className={`btn btn-sm ${statusFilter === 'COLLECTED' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Completed / Collected ({orders.filter((o) => o.status === 'COLLECTED').length})
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`btn btn-sm ${statusFilter === 'CANCELLED' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Cancelled ({orders.filter((o) => o.status === 'CANCELLED').length})
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving your canteen pre-orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1.5rem' }}>
            <ShoppingBag size={44} color="var(--neutral-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders in this Category</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You don't have any orders matching this filter.
            </p>
            <Link to="/menu" className="btn btn-primary btn-sm">
              Explore Canteen Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredOrders.map((order) => (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        color: 'var(--primary-800)',
                      }}>
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                      color: 'var(--neutral-500)',
                      fontSize: '0.8rem',
                      marginTop: '0.4rem',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} /> {order.pickupDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} /> {order.pickupSlot?.startTime?.substring(0, 5)} - {order.pickupSlot?.endTime?.substring(0, 5)}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: '800',
                      color: 'var(--neutral-900)',
                    }}>
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                      {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--neutral-50)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: 'var(--neutral-700)',
                }}>
                  {order.items?.map((it, idx) => (
                    <span key={it.id}>
                      <strong>{it.itemName}</strong> × {it.quantity}
                      {idx < order.items.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>

                {/* Card footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    to={`/orders/track/${order.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Track Status Live <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
