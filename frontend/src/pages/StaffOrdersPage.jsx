import React, { useEffect, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  Search,
  RefreshCw,
  XCircle,
  AlertCircle,
  Phone,
  User,
  MessageSquare
} from 'lucide-react';

const StaffOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      const res = await api.get('/staff/orders');
      if (res.data?.success && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto refresh queue every 10 seconds
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus, notes = '') => {
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/staff/orders/${orderId}/status`, {
        status: newStatus,
        notes: notes || `Moved to ${newStatus} by kitchen staff`,
      });

      if (res.data?.success && res.data.data) {
        // Update locally
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data.data : o))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;
    setUpdatingId(orderToCancel.id);
    try {
      const res = await api.patch(`/staff/orders/${orderToCancel.id}/status`, {
        status: 'CANCELLED',
        notes: 'Cancelled by kitchen staff (Item out of stock / unavailable)',
      });

      if (res.data?.success && res.data.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderToCancel.id ? res.data.data : o))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setUpdatingId(null);
      setCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusTab !== 'ALL' && o.status !== statusTab) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
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
              Kitchen Operations
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Kitchen Orders Fulfillment Board</h1>
          </div>
          <button onClick={() => fetchOrders(false)} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Queue
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search
                size={18}
                color="var(--neutral-400)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search by order token, student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Status Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStatusTab('ALL')}
                className={`btn btn-sm ${statusTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setStatusTab('PLACED')}
                className={`btn btn-sm ${statusTab === 'PLACED' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Placed ({orders.filter((o) => o.status === 'PLACED').length})
              </button>
              <button
                onClick={() => setStatusTab('PREPARING')}
                className={`btn btn-sm ${statusTab === 'PREPARING' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Preparing ({orders.filter((o) => o.status === 'PREPARING').length})
              </button>
              <button
                onClick={() => setStatusTab('READY')}
                className={`btn btn-sm ${statusTab === 'READY' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Ready ({orders.filter((o) => o.status === 'READY').length})
              </button>
            </div>
          </div>
        </div>

        {/* Orders Queue Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving operational kitchen orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1.5rem' }}>
            <ChefHat size={48} color="var(--neutral-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders in this Queue</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
              All current orders in this status category have been cleared and fulfilled.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}>
            {filteredOrders.map((order) => {
              const isUpdating = updatingId === order.id;

              return (
                <div
                  key={order.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: `4px solid ${
                      order.status === 'PLACED' ? '#3b82f6' :
                      order.status === 'PREPARING' ? 'var(--accent-500)' :
                      order.status === 'READY' ? 'var(--primary-600)' : 'var(--neutral-400)'
                    }`,
                  }}
                >
                  {/* Card Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        color: 'var(--neutral-900)',
                      }}>
                        {order.orderNumber}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--neutral-700)', marginTop: '0.2rem' }}>
                        <User size={14} color="var(--primary-700)" />
                        <strong>{order.customerName}</strong>
                      </div>
                      {order.customerPhone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '0.1rem' }}>
                          <Phone size={12} /> {order.customerPhone}
                        </div>
                      )}
                    </div>

                    <StatusBadge status={order.status} />
                  </div>

                  {/* Pickup Slot Banner */}
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--neutral-100)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    fontSize: '0.825rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--neutral-700)',
                  }}>
                    <Clock size={15} color="var(--primary-700)" />
                    <span>Slot: <strong>{order.pickupSlot?.startTime?.substring(0, 5)} - {order.pickupSlot?.endTime?.substring(0, 5)}</strong> ({order.pickupDate})</span>
                  </div>

                  {/* Ordered Items List */}
                  <div style={{
                    flex: 1,
                    marginBottom: '1.25rem',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Items to Prepare:
                    </div>
                    {order.items?.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0',
                          fontSize: '0.875rem',
                          borderBottom: '1px solid var(--neutral-200)',
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                          {it.itemName}
                        </span>
                        <span style={{
                          backgroundColor: 'var(--primary-100)',
                          color: 'var(--primary-800)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                        }}>
                          × {it.quantity}
                        </span>
                      </div>
                    ))}

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: '#92400e',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.35rem',
                      }}>
                        <MessageSquare size={13} flexShrink={0} style={{ marginTop: '2px' }} />
                        <span><strong>Note:</strong> {order.specialInstructions}</span>
                      </div>
                    )}
                  </div>

                  {/* Operational Action Buttons */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--neutral-200)' }}>
                    {order.status === 'PLACED' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(order.id, 'PREPARING')}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, backgroundColor: 'var(--accent-600)', borderColor: 'var(--accent-600)' }}
                        >
                          <ChefHat size={15} /> Start Preparing
                        </button>
                        <button
                          disabled={isUpdating}
                          onClick={() => {
                            setOrderToCancel(order);
                            setCancelModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger-600)' }}
                          title="Reject / Cancel"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'READY')}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', backgroundColor: 'var(--primary-600)' }}
                      >
                        <CheckCircle2 size={15} /> Mark Ready for Pickup
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'COLLECTED')}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', backgroundColor: 'var(--neutral-800)', color: 'var(--white)' }}
                      >
                        <PackageCheck size={15} /> Confirm Handover & Collected
                      </button>
                    )}

                    {order.status === 'COLLECTED' && (
                      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: '600' }}>
                        ✓ Order Handover Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Confirmation Modal for Staff Cancellation */}
        <ConfirmModal
          isOpen={cancelModalOpen}
          title="Reject / Cancel Order?"
          message={`Are you sure you want to cancel order ${orderToCancel?.orderNumber}? The customer will be informed that items are unavailable.`}
          confirmText="Yes, Reject Order"
          isDanger={true}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default StaffOrdersPage;
