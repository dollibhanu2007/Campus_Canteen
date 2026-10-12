import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, AlertCircle, ArrowRight, ShieldCheck, ChefHat, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'ROLE_STAFF') {
        navigate('/staff', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-700)',
            color: 'var(--white)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 10px rgba(4, 120, 87, 0.35)',
          }}>
            <UtensilsCrossed size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.875rem' }}>
            Sign in to pre-order food, track meals, or manage canteen orders.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'var(--danger-50)',
            border: '1px solid var(--danger-100)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger-600)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Campus Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="e.g. student@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Canteen Portal'}
          </button>
        </form>

        {/* DEMO ACCOUNTS QUICK-FILL */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--neutral-200)',
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: 'var(--neutral-500)',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}>
            Quick Demo Logins (Click to autofill)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('student@campus.edu', 'Student@123')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', flexDirection: 'column', gap: '0.2rem' }}
            >
              <User size={14} color="var(--primary-700)" />
              <span>Student</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('staff@campus.edu', 'Staff@123')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', flexDirection: 'column', gap: '0.2rem' }}
            >
              <ChefHat size={14} color="var(--accent-600)" />
              <span>Staff</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('admin@campus.edu', 'Admin@123')}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', flexDirection: 'column', gap: '0.2rem' }}
            >
              <ShieldCheck size={14} color="#2563eb" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary-700)', fontWeight: '700' }}>
            Register as Student/Staff
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
