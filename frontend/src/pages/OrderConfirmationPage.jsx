import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  CheckCircle2,
  Clock,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Printer,
  UtensilsCrossed
} from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const navigate = useNavigate();

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/number/${orderNumber}`);
          if (res.data?.success && res.data.data) {
            setOrder(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load order', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--neutral-500)' }}>
        Retrieving order confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Order Not Found</h2>
            <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem' }}>
              We could not find the order details for token: {orderNumber}.
            </p>
            <Link to="/orders" className="btn btn-primary">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          {/* Success Checkmark */}
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-700)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 0 8px var(--primary-100)',
          }}>
            <CheckCircle2 size={44} />
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Pre-Order Received!</h1>
          <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your meal has been dispatched to the canteen kitchen counter.
          </p>

          {/* Token Box */}
          <div style={{
            backgroundColor: 'var(--neutral-100)',
            border: '2px dashed var(--neutral-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--neutral-500)',
              marginBottom: '0.4rem',
            }}>
              Your Counter Pickup Token
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: '800',
              color: 'var(--primary-800)',
              letterSpacing: '0.05em',
            }}>
              {order.orderNumber}
            </div>
          </div>

          {/* Order Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.9rem',
          }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neutral-500)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                <Calendar size={14} /> PICKUP DATE
              </div>
              <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                {order.pickupDate}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neutral-500)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                <Clock size={14} /> TIME SLOT
              </div>
              <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                {order.pickupSlot?.startTime?.substring(0, 5)} - {order.pickupSlot?.endTime?.substring(0, 5)}
              </div>
            </div>
          </div>

          {/* Itemized List */}
          <div style={{
            backgroundColor: 'var(--neutral-50)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.875rem',
          }}>
            <div style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--neutral-700)' }}>
              Ordered Items ({order.items?.length || 0})
            </div>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                <span>{item.itemName} × {item.quantity}</span>
                <span style={{ fontWeight: '700' }}>₹{Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              marginTop: '0.5rem',
              borderTop: '1px solid var(--neutral-200)',
              fontWeight: '800',
              fontSize: '1.1rem',
            }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary-800)' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to={`/orders/track/${order.id}`}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Track Order Status Live <ArrowRight size={18} />
            </Link>

            <Link
              to="/orders"
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              View All My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
