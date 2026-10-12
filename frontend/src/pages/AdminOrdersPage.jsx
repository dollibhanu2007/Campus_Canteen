import React, { useEffect, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  ShoppingBag,
  Search,
  Filter,
  Calendar,
  Eye,
  X,
  RefreshCw,
  Clock,
  User,
  Phone
} from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = '/admin/orders?page=0&size=50';
      if (statusFilter) query += `&status=${statusFilter}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await api.get(query);
      if (res.data?.success && res.data.data?.content) {
        setOrders(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

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
              Master Transaction Log
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>All Campus Canteen Orders</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Comprehensive real-time view of customer orders, collection time slots, and status lifecycles.
            </p>
          </div>

          <button onClick={fetchOrders} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Orders
          </button>
        </div>

        {/* Filter Controls Card */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Order Token</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CC-261011..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
              </div>
            </div>

            <div style={{ flex: '1 1 150px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Status Filter</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PLACED">Placed (Pending)</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="COLLECTED">Collected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div style={{ flex: '1 1 140px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div style={{ flex: '1 1 140px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ height: '38px' }}>
              Apply Filters
            </button>

            {(searchTerm || statusFilter || startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ height: '38px' }}
              >
                Reset
              </button>
            )}
          </form>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving orders from MySQL database...
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1.5rem' }}>
            <ShoppingBag size={44} color="var(--neutral-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
              No orders matched the current date, status, or search query parameters.
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order Token</th>
                    <th>Customer</th>
                    <th>Pickup Date & Slot</th>
                    <th>Items</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div style={{ fontWeight: '800', color: 'var(--primary-800)', fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>
                          {order.orderNumber}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--neutral-400)' }}>
                          Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{order.customerEmail}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--neutral-800)', fontSize: '0.85rem' }}>
                          {order.pickupDate}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                          {order.pickupSlot?.startTime?.substring(0, 5)} - {order.pickupSlot?.endTime?.substring(0, 5)}
                        </div>
                      </td>

                      <td style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                        {order.items?.length} items ({order.items?.map((it) => `${it.itemName} × ${it.quantity}`).join(', ').substring(0, 35)}...)
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--neutral-900)' }}>
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </td>

                      <td>
                        <StatusBadge status={order.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn btn-secondary btn-sm"
                          title="Inspect Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Order #{selectedOrder.orderNumber}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                    Customer: {selectedOrder.customerName} ({selectedOrder.customerEmail})
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--neutral-400)' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <StatusBadge status={selectedOrder.status} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                    Payment: <strong>{selectedOrder.paymentMethod}</strong>
                  </span>
                </div>

                <div style={{ padding: '0.85rem', backgroundColor: 'var(--neutral-100)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div>Pickup Date: <strong>{selectedOrder.pickupDate}</strong></div>
                  <div>Slot: <strong>{selectedOrder.pickupSlot?.slotLabel}</strong></div>
                  {selectedOrder.specialInstructions && (
                    <div style={{ marginTop: '0.35rem', color: '#92400e' }}>
                      Special Notes: {selectedOrder.specialInstructions}
                    </div>
                  )}
                  {selectedOrder.cancellationReason && (
                    <div style={{ marginTop: '0.35rem', color: 'var(--danger-600)' }}>
                      Cancellation Reason: {selectedOrder.cancellationReason}
                    </div>
                  )}
                </div>

                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Ordered Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {selectedOrder.items?.map((it) => (
                    <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span>{it.itemName} × {it.quantity}</span>
                      <span style={{ fontWeight: '700' }}>₹{Number(it.lineTotal).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--neutral-200)', fontWeight: '800', fontSize: '1.1rem' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary-800)' }}>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Lifecycle Audit Trail</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {selectedOrder.statusHistory?.map((h) => (
                    <div key={h.id} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-200)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{h.newStatus}</strong>
                        <span style={{ color: 'var(--neutral-400)' }}>
                          {new Date(h.changedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: 'var(--neutral-600)' }}>{h.notes}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--neutral-400)' }}>Changed by: {h.changedByName}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
