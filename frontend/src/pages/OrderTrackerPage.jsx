import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import OrderTimeline from '../components/OrderTimeline';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import {
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChefHat,
  PackageCheck
} from 'lucide-react';

const OrderTrackerPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrder = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data?.success && res.data.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      if (!isPolling) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Poll every 5 seconds for real-time status updates
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.post(`/orders/${id}/cancel`, {
        reason: cancelReason || 'Cancelled by customer',
      });
      if (res.data?.success && res.data.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order.');
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--neutral-500)' }}>
        Loading order tracking timeline...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <AlertCircle size={44} color="var(--danger-500)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Unable to Track Order</h2>
            <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem' }}>{error || 'Order was not found'}</p>
            <Link to="/orders" className="btn btn-secondary">
              <ArrowLeft size={16} /> Return to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>

        {/* Main Status Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--neutral-200)',
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: '600' }}>
                Counter Pickup Token
              </div>
              <h1 style={{ fontSize: '2rem', color: 'var(--primary-800)', letterSpacing: '0.02em' }}>
                {order.orderNumber}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <StatusBadge status={order.status} />
              <button
                onClick={() => fetchOrder(false)}
                className="btn btn-secondary btn-sm"
                title="Refresh order status"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {/* Real-time notification banners */}
          {order.status === 'READY' && (
            <div style={{
              margin: '1.5rem 0',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              border: '2px solid var(--primary-500)',
              color: 'var(--primary-900)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <CheckCircle size={32} color="var(--primary-600)" flexShrink={0} />
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>
                  Your Meal is Ready for Collection!
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--neutral-700)' }}>
                  Please proceed to the canteen pickup counter with token <strong>{order.orderNumber}</strong>.
                </div>
              </div>
            </div>
          )}

          {order.status === 'PREPARING' && (
            <div style={{
              margin: '1.5rem 0',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-50)',
              border: '1px solid var(--accent-400)',
              color: 'var(--accent-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <ChefHat size={24} flexShrink={0} />
              <div style={{ fontSize: '0.9rem' }}>
                The kitchen cooks are preparing your fresh meal right now. It will be ready shortly!
              </div>
            </div>
          )}

          {/* Visual 4-Step Timeline */}
          <OrderTimeline status={order.status} />

          {/* Schedule Info Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontWeight: '700' }}>SCHEDULED DATE</div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginTop: '0.2rem' }}>{order.pickupDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontWeight: '700' }}>TIME WINDOW</div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {order.pickupSlot?.startTime?.substring(0, 5)} - {order.pickupSlot?.endTime?.substring(0, 5)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontWeight: '700' }}>PAYMENT METHOD</div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {order.paymentMethod === 'CAMPUS_CARD' ? 'Campus Smart ID' : 'Pay at Counter'}
              </div>
            </div>
          </div>

          {/* Cancellation Control (Only permitted when status is PLACED) */}
          {order.status === 'PLACED' && (
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--neutral-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>
                Need to cancel? Permitted only before the kitchen begins cooking.
              </span>
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger-600)' }}
              >
                <XCircle size={15} /> Cancel Order
              </button>
            </div>
          )}
        </div>

        {/* Itemized Order Details & Audit Trail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Items Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-200)' }}>
              Ordered Items
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.itemName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                      ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--neutral-900)' }}>
                    ₹{Number(item.lineTotal).toFixed(2)}
                  </div>
                </div>
              ))}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--neutral-200)',
                fontSize: '1.1rem',
                fontWeight: '800',
              }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary-800)' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Audit History Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-200)' }}>
              Status Timeline Log
            </h3>
            {order.statusHistory?.length === 0 ? (
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.85rem' }}>No status logs recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {order.statusHistory?.map((h) => (
                  <div key={h.id} style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--neutral-50)',
                    border: '1px solid var(--neutral-200)',
                    fontSize: '0.825rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{h.newStatus}</span>
                      <span style={{ color: 'var(--neutral-400)', fontSize: '0.75rem' }}>
                        {new Date(h.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ color: 'var(--neutral-600)' }}>{h.notes}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-400)', marginTop: '0.2rem' }}>
                      By: {h.changedByName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Confirmation Dialog */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Cancel Pre-Order?"
          message="Are you sure you want to cancel this order? This action cannot be reversed once confirmed."
          confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          isDanger={true}
          onConfirm={handleCancelOrder}
          onClose={() => setShowCancelModal(false)}
        />
      </div>
    </div>
  );
};

export default OrderTrackerPage;
