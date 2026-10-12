import React, { useEffect, useState } from 'react';
import api from '../api/client';
import {
  ShieldCheck,
  RefreshCw,
  Clock,
  User,
  Activity
} from 'lucide-react';

const AdminActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/activity-logs');
      if (res.data?.success && res.data.data) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
              System Auditing
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Administrative Activity Logs</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Immutable audit records of critical changes made to users, menus, slots, and categories.
            </p>
          </div>

          <button onClick={fetchLogs} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Logs
          </button>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--neutral-500)' }}>
            Retrieving activity audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 1.5rem' }}>
            <Activity size={44} color="var(--neutral-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Administrative Activity Logged Yet</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
              Management actions (e.g. creating items, toggling user accounts, editing slots) will automatically log audit trails here.
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target Entity</th>
                    <th>Action Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--neutral-900)', fontSize: '0.875rem' }}>
                          {log.actorName}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--neutral-400)' }}>
                          {log.actorEmail}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', border: '1px solid var(--primary-100)' }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ color: 'var(--neutral-700)', fontSize: '0.85rem' }}>
                        {log.entityType} #{log.entityId}
                      </td>
                      <td style={{ color: 'var(--neutral-800)', fontSize: '0.85rem' }}>
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLogsPage;
