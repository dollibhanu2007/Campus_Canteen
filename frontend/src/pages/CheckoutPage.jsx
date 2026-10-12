import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Clock,
  Calendar,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CAMPUS_COUNTER_PAY');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If cart empty, redirect to menu
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/menu');
    }
  }, [cartItems, navigate]);

  // Fetch slots whenever pickup date changes
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setError('');
        const res = await api.get(`/slots?date=${pickupDate}`);
        if (res.data?.success && res.data.data) {
          setSlots(res.data.data);
          // Auto select first available slot
          const firstAvailable = res.data.data.find((s) => s.availableForBooking);
          if (firstAvailable) {
            setSelectedSlotId(firstAvailable.id);
          } else {
            setSelectedSlotId('');
          }
        }
      } catch (err) {
        setError('Failed to load pickup slots for selected date');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [pickupDate]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedSlotId) {
      setError('Please select an available pickup time slot');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        pickupDate,
        pickupSlotId: Number(selectedSlotId),
        paymentMethod,
        specialInstructions,
        items: cartItems.map((ci) => ({
          menuItemId: ci.id,
          quantity: ci.quantity,
        })),
      };

      const res = await api.post('/orders', payload);
      if (res.data?.success && res.data.data) {
        const createdOrder = res.data.data;
        clearCart();
        navigate(`/orders/confirmation/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please review items and selected slot.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--primary-700)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.35rem',
          }}>
            Final Step
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Schedule Pickup & Place Order</h1>
          <p style={{ color: 'var(--neutral-600)', marginTop: '0.3rem' }}>
            Choose when you will collect your freshly prepared meal from the counter.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--danger-50)',
            border: '1px solid var(--danger-100)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger-600)',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            <AlertCircle size={20} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}>
            {/* Left Column: Date & Slot Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Pickup Date Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--primary-700)" /> 1. Select Pickup Date
                </h3>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input
                    type="date"
                    min={todayStr}
                    className="form-input"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '0.3rem' }}>
                    Orders can be scheduled for today or upcoming days.
                  </span>
                </div>
              </div>

              {/* Pickup Slot Picker */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--primary-700)" /> 2. Select Pickup Time Slot
                </h3>

                {loadingSlots ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--neutral-500)' }}>
                    Checking slot availability...
                  </div>
                ) : slots.length === 0 ? (
                  <div style={{ color: 'var(--danger-600)', fontSize: '0.875rem' }}>
                    No pickup slots configured for this date.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {slots.map((slot) => {
                      const isSelected = String(selectedSlotId) === String(slot.id);
                      const isAvailable = slot.availableForBooking;
                      const remaining = Math.max(0, slot.capacity - slot.currentBookings);

                      return (
                        <label
                          key={slot.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${isSelected ? 'var(--primary-600)' : 'var(--neutral-200)'}`,
                            backgroundColor: isSelected ? 'var(--primary-50)' : isAvailable ? 'var(--white)' : 'var(--neutral-100)',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.6,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                              type="radio"
                              name="pickupSlot"
                              disabled={!isAvailable}
                              checked={isSelected}
                              onChange={() => setSelectedSlotId(slot.id)}
                              style={{ accentColor: 'var(--primary-700)' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--neutral-900)' }}>
                                {slot.slotLabel}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                                {slot.startTime.substring(0, 5)} to {slot.endTime.substring(0, 5)}
                              </div>
                            </div>
                          </div>

                          <div>
                            {isAvailable ? (
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                                {remaining} slots left
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--danger-600)' }}>
                                {slot.currentBookings >= slot.capacity ? 'Full Capacity' : 'Slot Passed'}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} color="var(--primary-700)" /> 3. Cooking Notes / Allergies (Optional)
                </h3>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Extra spicy, less oil, pack chutney separately..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Order Review & Demo Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Payment Method Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="var(--primary-700)" /> 4. Payment Selection (Academic Demo)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === 'CAMPUS_COUNTER_PAY' ? 'var(--primary-50)' : 'var(--white)',
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CAMPUS_COUNTER_PAY"
                      checked={paymentMethod === 'CAMPUS_COUNTER_PAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: 'var(--primary-700)' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Pay at Counter (Cash / UPI / QR)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                        Pay when you collect your warm food at the pickup window.
                      </div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === 'CAMPUS_CARD' ? 'var(--primary-50)' : 'var(--white)',
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CAMPUS_CARD"
                      checked={paymentMethod === 'CAMPUS_CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: 'var(--primary-700)' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Campus Smart ID Card</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                        Deduct directly from your registered student canteen balance.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Final Summary Card */}
              <div className="card" style={{ padding: '1.75rem', backgroundColor: '#fcfdfd' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-200)' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                  {cartItems.map((ci) => (
                    <div key={ci.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--neutral-700)' }}>{ci.name} × {ci.quantity}</span>
                      <span style={{ fontWeight: '700' }}>₹{(Number(ci.price) * ci.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--neutral-200)',
                    fontSize: '1.15rem',
                    fontWeight: '800',
                  }}>
                    <span>Grand Total:</span>
                    <span style={{ color: 'var(--primary-800)' }}>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedSlotId}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  {submitting ? 'Placing Pre-Order...' : 'Confirm & Place Pre-Order'}
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--neutral-500)',
                  justifyContent: 'center',
                }}>
                  <ShieldCheck size={16} color="var(--primary-600)" />
                  <span>Unique Order Token will be generated upon confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
