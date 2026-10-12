import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  UtensilsCrossed
} from 'lucide-react';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff/orders');
      if (res.data?.success && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load operational orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const placedCount = orders.filter((o) => o.status === 'PLACED').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;

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
              Canteen Operational Station
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Kitchen Staff Dashboard</h1>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.2rem' }}>
              Manage active kitchen queues, advance order preparation statuses, and toggle food availability.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchStaffData} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Refresh Live Queue
            </button>
            <Link to="/staff/menu" className="btn btn-secondary btn-sm">
              <UtensilsCrossed size={14} /> Stock Availability
            </Link>
          </div>
        </div>

        {/* 3 Active Queue KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          <div className="card" style={{ borderLeft: '5px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  NEW ORDERS (PLACED)
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e40af', marginTop: '0.2rem' }}>
                  {placedCount}
                </div>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Clock size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Awaiting chef preparation start
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid var(--accent-500)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  IN PREPARATION
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-600)', marginTop: '0.2rem' }}>
                  {preparingCount}
                </div>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-50)',
                color: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ChefHat size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Currently cooking in kitchen
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neutral-500)' }}>
                  READY FOR PICKUP
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-700)', marginTop: '0.2rem' }}>
                  {readyCount}
                </div>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle2 size={24} />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
              Warm at counter awaiting student collection
            </div>
          </div>
        </div>

        {/* Operational Dispatch Banner */}
        <div className="card" style={{
          backgroundColor: 'var(--neutral-900)',
          color: 'var(--white)',
          padding: '2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--white)', marginBottom: '0.4rem' }}>
              Active Kitchen Fulfillment Board
            </h2>
            <p style={{ color: 'var(--neutral-300)', fontSize: '0.925rem' }}>
              You have {orders.length} active orders pending fulfillment. Switch order statuses as items are prepared and handed over.
            </p>
          </div>

          <Link to="/staff/orders" className="btn btn-accent btn-lg">
            Open Kitchen Orders Queue <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
