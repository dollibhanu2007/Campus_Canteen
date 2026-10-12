import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import {
  Search,
  Filter,
  Clock,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [vegOnly, setVegOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const [itemQuantities, setItemQuantities] = useState({});
  const [addedItem, setAddedItem] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [catRes, itemRes] = await Promise.all([
          api.get('/categories'),
          api.get('/menu'),
        ]);

        if (catRes.data?.success) {
          setCategories(catRes.data.data);
        }
        if (itemRes.data?.success) {
          setItems(itemRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load menu data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val) {
      searchParams.set('q', val);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory && item.categoryId !== Number(selectedCategory)) {
      return false;
    }
    if (vegOnly && !item.isVeg) {
      return false;
    }
    if (availableOnly && !item.available) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.categoryName?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const getQuantity = (id) => itemQuantities[id] || 1;

  const setQuantity = (id, delta) => {
    setItemQuantities((prev) => {
      const curr = prev[id] || 1;
      const next = Math.max(1, curr + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = (item) => {
    const qty = getQuantity(item.id);
    addToCart(item, qty);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--primary-700)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.35rem',
          }}>
            Campus Dining Selection
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Canteen Food Menu</h1>
          <p style={{ color: 'var(--neutral-600)', marginTop: '0.4rem', fontSize: '1rem' }}>
            Browse through daily campus favorites. Select your meal and reserve it for instant counter pickup.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search
                size={18}
                color="var(--neutral-400)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search food by name, description, ingredients..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  style={{ accentColor: 'var(--primary-600)' }}
                />
                Pure Veg Only
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  style={{ accentColor: 'var(--primary-600)' }}
                />
                In Stock Only
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingTop: '1rem',
            marginTop: '1rem',
            borderTop: '1px solid var(--neutral-100)',
          }}>
            <button
              onClick={() => handleCategorySelect('')}
              className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              All Items ({items.length})
            </button>
            {categories.map((cat) => {
              const count = items.filter((i) => i.categoryId === cat.id).length;
              const isSelected = selectedCategory === String(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(String(cat.id))}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Loading menu items from canteen database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1.5rem' }}>
            <AlertCircle size={44} color="var(--neutral-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Food Items Match Your Filters</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              Try clearing your search query or selecting a different category to view available canteen meals.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setVegOnly(false);
                setAvailableOnly(false);
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: item.available ? 1 : 0.75,
                }}
              >
                {/* Image & tags */}
                <div style={{ position: 'relative', height: '200px', backgroundColor: 'var(--neutral-100)' }}>
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
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: 'var(--neutral-700)' }}>
                      {item.categoryName}
                    </span>
                  </div>

                  {!item.available && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      color: 'var(--white)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.15rem',
                      letterSpacing: '0.05em',
                    }}>
                      <div>SOLD OUT</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.85 }}>Check back in next slot</div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>{item.name}</h3>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.3rem',
                      fontWeight: '800',
                      color: 'var(--primary-800)',
                      whiteSpace: 'nowrap',
                      marginLeft: '0.75rem',
                    }}>
                      ₹{Number(item.price).toFixed(2)}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--neutral-600)',
                    lineHeight: '1.5',
                    marginBottom: '1.25rem',
                    flex: 1,
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--neutral-100)',
                  }}>
                    {/* Quantity selectors */}
                    {item.available ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--neutral-100)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.2rem',
                      }}>
                        <button
                          onClick={() => setQuantity(item.id, -1)}
                          style={{
                            padding: '0.35rem 0.55rem',
                            color: 'var(--neutral-700)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '700', fontSize: '0.875rem' }}>
                          {getQuantity(item.id)}
                        </span>
                        <button
                          onClick={() => setQuantity(item.id, 1)}
                          style={{
                            padding: '0.35rem 0.55rem',
                            color: 'var(--neutral-700)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--danger-600)', fontWeight: '600' }}>
                        Unavailable
                      </span>
                    )}

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.available}
                      className={`btn btn-sm ${addedItem === item.id ? 'btn-accent' : 'btn-primary'}`}
                    >
                      {addedItem === item.id ? (
                        <>
                          <CheckCircle size={14} /> Added!
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
    </div>
  );
};

export default MenuPage;
