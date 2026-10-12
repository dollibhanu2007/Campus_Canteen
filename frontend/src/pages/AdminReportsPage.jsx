import React, { useEffect, useState } from 'react';
import api from '../api/client';
import {
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  ShoppingBag,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';

const AdminReportsPage = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(todayStr);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`);
      if (res.data?.success && res.data.data) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load sales report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const avgOrderValue = report?.totalOrders > 0
    ? Number(report.totalRevenue) / report.totalOrders
    : 0;

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
              Financial Intelligence
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Canteen Sales & Revenue Reports</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Analyze campus meal sales over custom date windows (strictly excludes cancelled orders).
            </p>
          </div>

          <button onClick={fetchReport} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* Date Filter Card */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleApplyFilter} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Start Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>End Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ height: '40px' }}>
              <Calendar size={15} /> Compute Report
            </button>
          </form>
        </div>

        {/* 3 Analytics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          <div className="card" style={{ borderLeft: '5px solid var(--primary-600)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
              TOTAL REVENUE IN SELECTED WINDOW
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: '800',
              color: 'var(--primary-800)',
              marginTop: '0.2rem',
            }}>
              ₹{Number(report?.totalRevenue || 0).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Between {startDate} and {endDate}
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid #2563eb' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
              TOTAL FULFILLED ORDERS
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: '800',
              color: '#1e40af',
              marginTop: '0.2rem',
            }}>
              {report?.totalOrders || 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Meal tickets placed & processed
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid var(--accent-500)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
              AVERAGE TICKET / ORDER VALUE
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: '800',
              color: 'var(--accent-600)',
              marginTop: '0.2rem',
            }}>
              ₹{avgOrderValue.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Average student meal basket size
            </div>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--neutral-200)' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Daily Breakdown Trend</h3>
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--neutral-500)' }}>
              Computing daily breakdown...
            </div>
          ) : report?.dailyBreakdown?.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--neutral-500)' }}>
              No orders found in the selected date range. Try expanding the date range.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th style={{ textAlign: 'center' }}>Orders Fulfilled</th>
                    <th style={{ textAlign: 'right' }}>Total Revenue (₹)</th>
                    <th style={{ textAlign: 'right' }}>Average / Order</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.dailyBreakdown?.map((row) => {
                    const avg = row.orderCount > 0 ? Number(row.totalSales) / row.orderCount : 0;
                    return (
                      <tr key={row.date}>
                        <td style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                          {row.date}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>
                          {row.orderCount}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--primary-800)' }}>
                          ₹{Number(row.totalSales).toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--neutral-600)' }}>
                          ₹{avg.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
