import React, { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  X,
  RefreshCw,
  Layers
} from 'lucide-react';

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    available: true,
    isVeg: true,
    preparationTimeMins: 10,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemRes, catRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories'),
      ]);
      if (itemRes.data?.success) setItems(itemRes.data.data);
      if (catRes.data?.success) {
        setCategories(catRes.data.data);
        if (catRes.data.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load menu or categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      price: '',
      imageUrl: '',
      available: true,
      isVeg: true,
      preparationTimeMins: 10,
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      categoryId: item.categoryId,
      price: item.price,
      imageUrl: item.imageUrl || '',
      available: item.available,
      isVeg: item.isVeg,
      preparationTimeMins: item.preparationTimeMins || 10,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        preparationTimeMins: Number(formData.preparationTimeMins),
      };

      if (editingItem) {
        const res = await api.put(`/admin/menu/${editingItem.id}`, payload);
        if (res.data?.success) {
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? res.data.data : i))
          );
        }
      } else {
        const res = await api.post('/admin/menu', payload);
        if (res.data?.success) {
          setItems((prev) => [res.data.data, ...prev]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/admin/menu/${itemToDelete.id}`);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete menu item');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
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
              Inventory Catalog
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Menu Items Management</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Create new food offerings, update prices, change descriptions, and remove obsolete items.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchData} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Food Item
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <Search
              size={18}
              color="var(--neutral-400)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Items Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving menu database...
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Diet</th>
                    <th>Prep Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                            alt={item.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              backgroundColor: 'var(--neutral-100)',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                              {item.description ? item.description.substring(0, 45) + '...' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--neutral-700)', fontSize: '0.85rem' }}>
                        {item.categoryName}
                      </td>
                      <td style={{ fontWeight: '800', color: 'var(--primary-800)' }}>
                        ₹{Number(item.price).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                        {item.preparationTimeMins || 10} mins
                      </td>
                      <td>
                        {item.available ? (
                          <span className="badge badge-ready">In Stock</span>
                        ) : (
                          <span className="badge badge-cancelled">Sold Out</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditModal(item)}
                            className="btn btn-secondary btn-sm"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setItemToDelete(item);
                              setDeleteModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger-600)' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.2rem' }}>
                  {editingItem ? 'Edit Menu Item' : 'Add New Food Item'}
                </h3>
                <button onClick={() => setModalOpen(false)} style={{ color: 'var(--neutral-400)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {formError && (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--danger-50)',
                      border: '1px solid var(--danger-100)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--danger-600)',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}>
                      {formError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Food Item Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Masala Dosa"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        required
                        className="form-select"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        className="form-input"
                        placeholder="55.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Detailed taste, portion size, and sides..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Prep Time (Mins)</label>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        value={formData.preparationTimeMins}
                        onChange={(e) => setFormData({ ...formData, preparationTimeMins: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ justifyContent: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', marginTop: '1.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.isVeg}
                          onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                          style={{ accentColor: 'var(--primary-600)' }}
                        />
                        Vegetarian
                      </label>
                    </div>

                    <div className="form-group" style={{ justifyContent: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', marginTop: '1.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.available}
                          onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                          style={{ accentColor: 'var(--primary-600)' }}
                        />
                        Available (In Stock)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                    {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Menu Item?"
          message={`Are you sure you want to remove '${itemToDelete?.name}' from the canteen menu? Past order item snapshots will remain intact.`}
          confirmText="Yes, Delete Item"
          isDanger={true}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default AdminMenuPage;
