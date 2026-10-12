import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed
} from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3.5rem 2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--neutral-100)',
              color: 'var(--neutral-400)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <ShoppingBag size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Canteen Cart is Empty</h2>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.925rem', marginBottom: '2rem' }}>
              Looks like you haven't selected anything delicious from the campus canteen menu yet.
            </p>
            <Link to="/menu" className="btn btn-primary" style={{ width: '100%' }}>
              <UtensilsCrossed size={18} /> Browse Food Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

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
              marginBottom: '0.25rem',
            }}>
              Review Your Items
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Shopping Cart ({totalItemsCount} items)</h1>
          </div>
          <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-600)' }}>
            <Trash2 size={15} /> Clear Entire Cart
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}>
          {/* Itemized Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'center' }}>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                            alt={item.name}
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              backgroundColor: 'var(--neutral-100)',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{item.categoryName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        ₹{Number(item.price).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--neutral-100)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.15rem',
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: '0.3rem 0.5rem', color: 'var(--neutral-700)' }}
                            aria-label="Decrease"
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ padding: '0.3rem 0.5rem', color: 'var(--neutral-700)' }}
                            aria-label="Increase"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--primary-800)' }}>
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ color: 'var(--neutral-400)', padding: '0.4rem' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-200)' }}>
              Order Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neutral-600)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neutral-600)' }}>
                <span>Subsidized Campus GST / Tax</span>
                <span style={{ fontWeight: '600', color: 'var(--neutral-500)' }}>₹0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neutral-600)' }}>
                <span>Container / Eco Packing</span>
                <span style={{ fontWeight: '600', color: 'var(--primary-600)' }}>FREE</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '2px dashed var(--neutral-200)',
                fontSize: '1.2rem',
                fontWeight: '800',
                color: 'var(--neutral-900)',
              }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary-800)' }}>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Proceed to Slot Selection <ArrowRight size={18} />
            </button>

            <Link
              to="/menu"
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.875rem' }}
            >
              Continue Adding Items
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-800)',
              fontSize: '0.8rem',
            }}>
              <ShieldCheck size={18} flexShrink={0} />
              <span>Prices verified server-side. Zero hidden booking fees.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
