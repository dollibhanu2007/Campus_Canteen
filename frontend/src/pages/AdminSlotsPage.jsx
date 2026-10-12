import React, { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

const AdminSlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    slotLabel: '',
    startTime: '12:00',
    endTime: '12:45',
    capacity: 40,
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/slots');
      if (res.data?.success && res.data.data) {
        setSlots(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load slots', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const openAddModal = () => {
    setEditingSlot(null);
    setFormData({
      slotLabel: '',
      startTime: '12:00',
      endTime: '12:45',
      capacity: 40,
      active: true,
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setFormData({
      slotLabel: slot.slotLabel,
      startTime: slot.startTime?.substring(0, 5) || '12:00',
      endTime: slot.endTime?.substring(0, 5) || '12:45',
      capacity: slot.capacity,
      active: slot.active,
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
        slotLabel: formData.slotLabel,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
        capacity: Number(formData.capacity),
        active: formData.active,
      };

      if (editingSlot) {
        const res = await api.put(`/admin/slots/${editingSlot.id}`, payload);
        if (res.data?.success) {
          setSlots((prev) =>
            prev.map((s) => (s.id === editingSlot.id ? res.data.data : s))
          );
        }
      } else {
        const res = await api.post('/admin/slots', payload);
        if (res.data?.success) {
          setSlots((prev) => [...prev, res.data.data]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save pickup slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!slotToDelete) return;
    try {
      await api.delete(`/admin/slots/${slotToDelete.id}`);
      setSlots((prev) => prev.filter((s) => s.id !== slotToDelete.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete pickup slot');
    } finally {
      setDeleteModalOpen(false);
      setSlotToDelete(null);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
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
              Operational Scheduling
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Pickup Time Slots</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Configure collection windows, regulate rush hour capacities, and activate/deactivate time slots.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchSlots} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Pickup Slot
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving configured pickup slots...
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Slot Description</th>
                    <th>Time Window</th>
                    <th>Capacity Limit</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot.id}>
                      <td style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                        {slot.slotLabel}
                      </td>
                      <td style={{ color: 'var(--neutral-700)', fontSize: '0.9rem', fontWeight: '600' }}>
                        {slot.startTime?.substring(0, 5)} – {slot.endTime?.substring(0, 5)}
                      </td>
                      <td style={{ color: 'var(--primary-800)', fontWeight: '800' }}>
                        {slot.capacity} orders max
                      </td>
                      <td>
                        {slot.active ? (
                          <span className="badge badge-ready">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge badge-cancelled">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditModal(slot)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Slot"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setSlotToDelete(slot);
                              setDeleteModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger-600)' }}
                            title="Delete Slot"
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
                  {editingSlot ? 'Edit Pickup Slot' : 'Create Pickup Slot'}
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
                    <label className="form-label">Slot Label *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Lunch Rush Slot 1 (12:00 - 12:45)"
                      value={formData.slotLabel}
                      onChange={(e) => setFormData({ ...formData, slotLabel: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Start Time (HH:mm) *</label>
                      <input
                        type="time"
                        required
                        className="form-input"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">End Time (HH:mm) *</label>
                      <input
                        type="time"
                        required
                        className="form-input"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Max Capacity Limit *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-input"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ justifyContent: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', marginTop: '1.5rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                          style={{ accentColor: 'var(--primary-600)' }}
                        />
                        Active Slot
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                    {submitting ? 'Saving...' : editingSlot ? 'Update Slot' : 'Create Slot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Pickup Slot?"
          message={`Are you sure you want to delete pickup slot '${slotToDelete?.slotLabel}'? Future orders will not be able to choose this slot.`}
          confirmText="Yes, Delete Slot"
          isDanger={true}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default AdminSlotsPage;
