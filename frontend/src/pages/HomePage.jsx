import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import {
  Clock,
  Zap,
  ShieldCheck,
  ArrowRight,
  Plus,
  CheckCircle,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/menu');
        if (res.data?.success && res.data.data) {
          // pick top 6 items
          setFeaturedItems(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleQuickAdd = (item) => {
    addToCart(item, 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
        color: 'var(--white)',
        padding: '5rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0) 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: 'var(--accent-400)',
            }}>
              <Sparkles size={16} /> Fast, Contactless & Intelligent Campus Dining
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              color: 'var(--white)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}>
              Never Wait in a Canteen Queue Again.
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--primary-100)',
              lineHeight: '1.6',
              marginBottom: '2.5rem',
              fontWeight: '400',
            }}>
              Pre-order breakfast, wholesome meals, snacks, and beverages from your lecture hall or hostel. Pick your pickup time slot and grab your meal instantly upon arrival.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/menu" className="btn btn-accent btn-lg" style={{ boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)' }}>
                <ShoppingBag size={20} /> Browse Menu & Order Now
              </Link>
              <Link to="/orders" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--white)', borderColor: 'rgba(255,255,255,0.25)' }}>
                Track Your Order <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 VALUE PILLARS */}
      <section style={{ marginTop: '-3rem', position: 'relative', zIndex: 10, marginBottom: '4rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Zap size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Zero Queue Waiting</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                  Orders are dispatched directly to the kitchen counter display before your arrival.
                </p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-50)',
                color: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Clock size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Flexible Pickup Slots</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                  Select exact intervals fitting your lecture breaks and lunchtime rush hours.
                </p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Live Kitchen Tracking</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                  Watch real-time status change from Placed → Preparing → Ready with token verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CANTEEN SPECIALS */}
      <section style={{ padding: '2rem 0 5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
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
                Popular On Campus Today
              </div>
              <h2 style={{ fontSize: '2rem' }}>Chef's Canteen Specials</h2>
            </div>
            <Link to="/menu" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              View Complete Menu <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--neutral-500)' }}>
              Loading popular menu items...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}>
              {featuredItems.map((item) => (
                <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '190px', backgroundColor: 'var(--neutral-100)' }}>
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      gap: '0.4rem',
                    }}>
                      <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--neutral-700)' }}>
                        {item.categoryName}
                      </span>
                    </div>

                    {!item.available && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'var(--white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                      }}>
                        SOLD OUT
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>{item.name}</h3>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        color: 'var(--primary-800)',
                      }}>
                        ₹{Number(item.price).toFixed(2)}
                      </div>
                    </div>

                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--neutral-600)',
                      marginBottom: '1.25rem',
                      flex: 1,
                      lineHeight: '1.5',
                    }}>
                      {item.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--neutral-100)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                        <Clock size={14} /> {item.preparationTimeMins || 10} mins prep
                      </div>

                      <button
                        onClick={() => handleQuickAdd(item)}
                        disabled={!item.available}
                        className={`btn btn-sm ${addedItem === item.id ? 'btn-accent' : 'btn-primary'}`}
                      >
                        {addedItem === item.id ? (
                          <>
                            <CheckCircle size={14} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ backgroundColor: 'var(--white)', padding: '5rem 0', borderTop: '1px solid var(--neutral-200)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--primary-700)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            Smooth Campus Workflow
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '3rem' }}>How Campus Pre-Ordering Works</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            textAlign: 'left',
          }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-600)' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--primary-600)',
                marginBottom: '0.5rem',
              }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Browse Canteen Menu</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                Explore freshly updated breakfasts, meals, quick snacks, and beverages. Real-time availability indicators show what is in stock.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent-500)' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--accent-500)',
                marginBottom: '0.5rem',
              }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Select Pickup Slot</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                Pick an available pickup window (e.g. 10:15 - 10:45 AM). Capacity limits prevent crowding and keep kitchen dispatch fast.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #3b82f6' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: '800',
                color: '#3b82f6',
                marginBottom: '0.5rem',
              }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Live Kitchen Tracking</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                Your order gets queued for the cooks. Watch the timeline update as the kitchen prepares your items and marks them ready.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #10b981' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: '800',
                color: '#10b981',
                marginBottom: '0.5rem',
              }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Collect & Enjoy</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                Walk up to Counter 1 or 2 with your unique Order ID token, pick up your packed warm food, and dine with zero wasted time!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
