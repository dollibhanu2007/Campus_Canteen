import React, { useEffect, useState } from 'react';
import api from '../api/client';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data?.success && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setUpdatingId(user.id);
    const newActive = !user.active;

    try {
      const res = await api.patch(`/admin/users/${user.id}/status`, {
        active: newActive,
      });

      if (res.data?.success && res.data.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? res.data.data : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      if (res.data?.success && res.data.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? res.data.data : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
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
              Access & Security Control
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>User Accounts Management</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Assign authorized roles (Customer, Staff, Admin) and toggle account activation.
            </p>
          </div>

          <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Users
          </button>
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
              placeholder="Search by user name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving user records from database...
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role Assignment</th>
                    <th>Account Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isUpdating = updatingId === u.id;

                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{u.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>
                            ID: #{u.id} • Joined: {new Date(u.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ color: 'var(--neutral-700)' }}>{u.email}</td>
                        <td style={{ color: 'var(--neutral-600)', fontSize: '0.85rem' }}>
                          {u.phone || '—'}
                        </td>
                        <td>
                          <select
                            disabled={isUpdating}
                            className="form-select"
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.825rem',
                              fontWeight: '700',
                              width: 'auto',
                            }}
                          >
                            <option value="ROLE_CUSTOMER">Student / Customer</option>
                            <option value="ROLE_STAFF">Canteen Staff</option>
                            <option value="ROLE_ADMIN">Administrator</option>
                          </select>
                        </td>
                        <td>
                          {u.active ? (
                            <span className="badge badge-ready">
                              <UserCheck size={12} /> Active
                            </span>
                          ) : (
                            <span className="badge badge-cancelled">
                              <UserX size={12} /> Deactivated
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleToggleStatus(u)}
                            className={`btn btn-sm ${u.active ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ color: u.active ? 'var(--danger-600)' : 'var(--white)' }}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
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

export default AdminUsersPage;
