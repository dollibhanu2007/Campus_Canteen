import React, { useEffect, useState } from 'react';
import api from '../api/client';
import {
  UtensilsCrossed,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

const StaffMenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu');
      if (res.data?.success && res.data.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load menu items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleAvailability = async (item) => {
    setUpdatingId(item.id);
    const newStatus = !item.available;

    try {
      const res = await api.patch(`/staff/menu/${item.id}/availability`, {
        available: newStatus,
      });

      if (res.data?.success && res.data.data) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? res.data.data : i))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update item availability');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.categoryName?.toLowerCase().includes(q)
      );
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
              Stock & Inventory Control
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Kitchen Food Availability</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Instantly toggle items between In Stock and Sold Out to prevent students from ordering unavailable ingredients.
            </p>
          </div>

          <button onClick={fetchItems} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Stock
          </button>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search
              size={18}
              color="var(--neutral-400)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search items to toggle availability..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Table of items */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving food inventory...
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Menu Item</th>
                    <th>Category</th>
                    <th>Current Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Quick Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const isUpdating = updatingId === item.id;

                    return (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                              alt={item.name}
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: 'var(--radius-md)',
                                objectFit: 'cover',
                                backgroundColor: 'var(--neutral-100)',
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{item.name}</div>
                              <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.65rem' }}>
                                {item.isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--neutral-600)', fontSize: '0.85rem' }}>
                          {item.categoryName}
                        </td>
                        <td style={{ fontWeight: '700' }}>
                          ₹{Number(item.price).toFixed(2)}
                        </td>
                        <td>
                          {item.available ? (
                            <span className="badge badge-ready">
                              <CheckCircle2 size={12} /> In Stock
                            </span>
                          ) : (
                            <span className="badge badge-cancelled">
                              <XCircle size={12} /> Sold Out
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleToggleAvailability(item)}
                            className={`btn btn-sm ${item.available ? 'btn-danger' : 'btn-primary'}`}
                            style={{ minWidth: '130px' }}
                          >
                            {isUpdating ? (
                              'Updating...'
                            ) : item.available ? (
                              <>
                                <XCircle size={14} /> Mark Sold Out
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} /> Mark In Stock
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffMenuPage;
