import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  UtensilsCrossed,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Layers,
  BarChart3,
  Users,
  Clock,
  Menu,
  X,
  ShieldCheck,
  ChefHat
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isStaff, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--neutral-200)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-700)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(4, 120, 87, 0.3)'
          }}>
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: '800',
              color: 'var(--primary-900)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              Campus <span style={{ color: 'var(--accent-600)' }}>Canteen</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', fontWeight: '600' }}>
              Smart Pre-Order System
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link
            to="/menu"
            style={{
              fontWeight: isActive('/menu') ? '700' : '600',
              color: isActive('/menu') ? 'var(--primary-700)' : 'var(--neutral-600)',
              fontSize: '0.925rem',
            }}
          >
            Browse Menu
          </Link>

          {isCustomer && (
            <>
              <Link
                to="/customer"
                style={{
                  fontWeight: isActive('/customer') ? '700' : '600',
                  color: isActive('/customer') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/orders"
                style={{
                  fontWeight: isActive('/orders') ? '700' : '600',
                  color: isActive('/orders') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                }}
              >
                My Orders
              </Link>
            </>
          )}

          {isStaff && (
            <>
              <Link
                to="/staff"
                style={{
                  fontWeight: isActive('/staff') ? '700' : '600',
                  color: isActive('/staff') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ChefHat size={16} /> Kitchen Queue
              </Link>
              <Link
                to="/staff/menu"
                style={{
                  fontWeight: isActive('/staff/menu') ? '700' : '600',
                  color: isActive('/staff/menu') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                }}
              >
                Stock Availability
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                style={{
                  fontWeight: isActive('/admin') ? '700' : '600',
                  color: isActive('/admin') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <LayoutDashboard size={16} /> Admin Portal
              </Link>
              <Link
                to="/admin/orders"
                style={{
                  fontWeight: isActive('/admin/orders') ? '700' : '600',
                  color: isActive('/admin/orders') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                }}
              >
                Orders
              </Link>
              <Link
                to="/admin/menu"
                style={{
                  fontWeight: isActive('/admin/menu') ? '700' : '600',
                  color: isActive('/admin/menu') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                }}
              >
                Menu CRUD
              </Link>
              <Link
                to="/admin/reports"
                style={{
                  fontWeight: isActive('/admin/reports') ? '700' : '600',
                  color: isActive('/admin/reports') ? 'var(--primary-700)' : 'var(--neutral-600)',
                  fontSize: '0.925rem',
                }}
              >
                Reports
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cart Icon for Customer & Guests */}
          {(!user || isCustomer) && (
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--neutral-100)',
                color: 'var(--neutral-700)',
                transition: 'all 0.2s',
              }}
            >
              <ShoppingCart size={20} />
              {totalItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--accent-500)',
                    color: 'var(--neutral-900)',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neutral-100)',
                  border: '1px solid var(--neutral-200)',
                }}
              >
                <User size={16} color="var(--primary-700)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--neutral-900)' }}>
                    {user.fullName.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>
                    {user.role === 'ROLE_ADMIN' ? 'Admin' : user.role === 'ROLE_STAFF' ? 'Staff' : 'Student'}
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ padding: '0.5rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            style={{ display: 'none', padding: '0.5rem', color: 'var(--neutral-700)' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (min-width: 868px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 867px) {
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          padding: '1.25rem',
          backgroundColor: 'var(--white)',
          borderTop: '1px solid var(--neutral-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/menu" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
            Browse Menu
          </Link>
          {isCustomer && (
            <>
              <Link to="/customer" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Customer Dashboard
              </Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Order History
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Cart ({totalItemsCount})
              </Link>
            </>
          )}
          {isStaff && (
            <>
              <Link to="/staff" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Staff Kitchen Orders
              </Link>
              <Link to="/staff/menu" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Menu Stock Availability
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Admin Dashboard
              </Link>
              <Link to="/admin/orders" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Manage All Orders
              </Link>
              <Link to="/admin/menu" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Manage Menu Items
              </Link>
              <Link to="/admin/categories" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Manage Categories
              </Link>
              <Link to="/admin/slots" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Manage Pickup Slots
              </Link>
              <Link to="/admin/users" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Manage Users
              </Link>
              <Link to="/admin/reports" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Sales Reports
              </Link>
              <Link to="/admin/logs" onClick={() => setMobileOpen(false)} style={{ fontWeight: '600', padding: '0.4rem 0' }}>
                Admin Activity Logs
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}
            >
              <LogOut size={16} /> Log Out
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
