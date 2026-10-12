import React from 'react';
import { Clock, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--neutral-900)',
      color: 'var(--neutral-300)',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid var(--neutral-800)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: '800',
              color: 'var(--white)',
              marginBottom: '0.75rem',
            }}>
              Campus <span style={{ color: 'var(--accent-500)' }}>Canteen</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-400)', lineHeight: '1.6' }}>
              A Smart Way to Dine on Campus. Order your breakfast, lunch, and snacks ahead of time, avoid waiting in long queues, and collect piping hot food instantly.
            </p>
          </div>

          {/* Quick Hours */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: '1rem' }}>Canteen Operating Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neutral-300)' }}>
                <Clock size={16} color="var(--primary-500)" />
                <span>Mon – Fri: 08:00 AM – 06:30 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neutral-300)' }}>
                <Clock size={16} color="var(--primary-500)" />
                <span>Saturday: 08:30 AM – 03:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neutral-400)' }}>
                <Clock size={16} color="var(--accent-500)" />
                <span>Sunday: Closed (Campus Holiday)</span>
              </div>
            </div>
          </div>

          {/* Pickup Guidelines */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: '1rem' }}>Collection Points</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--neutral-400)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary-500)" />
                <span>Counter 1: Hot Meals & Thalis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary-500)" />
                <span>Counter 2: Quick Bites, Chai & Coffee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary-500)" />
                <span>Kitchen Helpline: Ext. 402</span>
              </div>
            </div>
          </div>

          {/* Verified System */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: '1rem' }}>Project Standards</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--neutral-400)', lineHeight: '1.6' }}>
              Built with Spring Boot 3 & React Vite. Powered by MySQL 8 database with strict role-based access control, server-side pricing snapshots, and real-time order lifecycle tracking.
            </p>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--neutral-800)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          color: 'var(--neutral-500)',
          gap: '1rem',
        }}>
          <div>
            © {new Date().getFullYear()} Campus Canteen Pre-Order System. Academic Capstone Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Made with</span>
            <Heart size={14} color="var(--danger-500)" fill="var(--danger-500)" />
            <span>for Campus Dining Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
