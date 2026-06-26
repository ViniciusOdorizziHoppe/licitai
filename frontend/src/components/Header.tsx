import { useAuth } from '../contexts/AuthContext';
import { Scale, LogOut, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Link
        to="/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          fontSize: '1.125rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
        }}
      >
        <Scale size={22} style={{ color: '#3b82f6' }} />
        <span style={{ color: '#3b82f6' }}>Licit</span>
        <span style={{ color: 'rgba(255,255,255,0.85)' }}>AI</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Credits Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#60a5fa',
          }}
        >
          <CreditCard size={13} />
          <span>Free</span>
        </div>

        {/* User */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={14} style={{ color: '#fff' }} />
          </div>
          {user?.name}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="btn-glass"
          style={{ padding: '0.375rem 0.75rem', gap: '0.375rem', fontSize: '0.8125rem' }}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </header>
  );
}
