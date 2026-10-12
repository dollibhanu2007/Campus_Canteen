import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/reports/sales'),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (reportsRes.data?.success) {
        setSalesReport(reportsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--neutral-500)' }}>
        Loading administrative metrics & financial summaries...
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
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
              System Administration
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Campus Canteen Control Center</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Real-time platform statistics, financial reports, inventory oversight, and user administration.
            </p>
          </div>

          <button onClick={fetchDashboardData} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Analytics
          </button>
        </div>

        {/* 4 Main KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Revenue */}
          <div className="card" style={{ borderLeft: '5px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  TOTAL NET SALES (NON-CANCELLED)
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: 'var(--primary-800)',
                  marginTop: '0.2rem',
                }}>
                  ₹{Number(stats?.totalSales || 0).toFixed(2)}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Calculated across all fulfilled meals
            </div>
          </div>

          {/* Total Orders */}
          <div className="card" style={{ borderLeft: '5px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  LIFETIME ORDERS PLACED
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e40af', marginTop: '0.2rem' }}>
                  {stats?.totalOrders || 0}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShoppingBag size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Completed: <strong>{stats?.completedOrders || 0}</strong> • Cancelled: {stats?.cancelledOrders || 0}
            </div>
          </div>

          {/* Active Menu Items */}
          <div className="card" style={{ borderLeft: '5px solid var(--accent-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  ACTIVE FOOD MENU ITEMS
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-600)', marginTop: '0.2rem' }}>
                  {stats?.activeMenuItems || 0}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-50)',
                color: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UtensilsCrossed size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Available for immediate pre-order
            </div>
          </div>

          {/* Users */}
          <div className="card" style={{ borderLeft: '5px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  REGISTERED ACCOUNTS
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6d28d9', marginTop: '0.2rem' }}>
                  {stats?.totalUsers || 0}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Students/Staff: <strong>{stats?.totalCustomers || 0}</strong> • Kitchen: {stats?.totalStaff || 0}
            </div>
          </div>
        </div>

        {/* Live Operational Pipeline Breakdown */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Live Order Pipeline State</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e40af' }}>PENDING (PLACED)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e3a8a', marginTop: '0.2rem' }}>
                {stats?.pendingOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting kitchen prep</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400e' }}>BEING PREPARED</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#78350f', marginTop: '0.2rem' }}>
                {stats?.preparingOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cooking in kitchen</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534' }}>READY AT COUNTER</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#14532d', marginTop: '0.2rem' }}>
                {stats?.readyOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Waiting for collection</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155' }}>COLLECTED TODAY</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginTop: '0.2rem' }}>
                {stats?.completedOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Handover completed</div>
            </div>
          </div>
        </div>

        {/* Daily Sales Table & Quick Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Daily Sales Breakdown */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Recent Daily Revenue Summary</h3>
              <Link to="/admin/reports" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: '700' }}>
                Full Report →
              </Link>
            </div>

            {salesReport?.dailyBreakdown?.length === 0 ? (
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', padding: '1rem 0' }}>
                No fulfilled sales recorded yet. Place and fulfill orders to populate daily revenue history.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th style={{ textAlign: 'center' }}>Orders</th>
                      <th style={{ textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport?.dailyBreakdown?.slice(0, 7).map((day) => (
                      <tr key={day.date}>
                        <td>{day.date}</td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{day.orderCount}</td>
                        <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--primary-800)' }}>
                          ₹{Number(day.totalSales).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Admin Navigation Grid */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Administrative Management Quick Access</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <Link to="/admin/orders" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <ShoppingBag size={18} color="var(--primary-700)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>All Orders</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Filter & inspect logs</div>
                </div>
              </Link>

              <Link to="/admin/menu" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <UtensilsCrossed size={18} color="var(--accent-600)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>Menu CRUD</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Add, edit, delete items</div>
                </div>
              </Link>

              <Link to="/admin/categories" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <Layers size={18} color="#2563eb" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>Categories</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Manage menu groups</div>
                </div>
              </Link>

              <Link to="/admin/slots" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <Clock size={18} color="#16a34a" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>Pickup Slots</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Configure capacity</div>
                </div>
              </Link>

              <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <Users size={18} color="#7c3aed" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>User Accounts</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Roles & status switches</div>
                </div>
              </Link>

              <Link to="/admin/reports" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <FileText size={18} color="#ea580c" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700' }}>Sales Reports</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Date-range analytics</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
