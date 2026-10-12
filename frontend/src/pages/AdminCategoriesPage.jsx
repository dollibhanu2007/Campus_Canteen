import React, { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw
} from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', displayOrder: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data?.success && res.data.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', displayOrder: categories.length + 1 });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      displayOrder: cat.displayOrder || 0,
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
        displayOrder: Number(formData.displayOrder),
      };

      if (editingCategory) {
        const res = await api.put(`/admin/categories/${editingCategory.id}`, payload);
        if (res.data?.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? res.data.data : c))
          );
        }
      } else {
        const res = await api.post('/admin/categories', payload);
        if (res.data?.success) {
          setCategories((prev) => [...prev, res.data.data]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await api.delete(`/admin/categories/${categoryToDelete.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
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
              Menu Taxonomy
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Menu Categories</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Organize food into intuitive groupings like Breakfast, Lunch Combos, Beverages, and Snacks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchCategories} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving categories...
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Display Order</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: '700', color: 'var(--neutral-500)', width: '120px' }}>
                        #{cat.displayOrder}
                      </td>
                      <td style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                        {cat.name}
                      </td>
                      <td style={{ color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
                        {cat.description || '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditModal(cat)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Category"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setDeleteModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger-600)' }}
                            title="Delete Category"
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
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.2rem' }}>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                    <label className="form-label">Category Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. South Indian Specials"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Order Sequence</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Short description of items in this group..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                    {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Menu Category?"
          message={`Are you sure you want to delete category '${categoryToDelete?.name}'? Note that menu items under this category should be reassigned.`}
          confirmText="Yes, Delete Category"
          isDanger={true}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
