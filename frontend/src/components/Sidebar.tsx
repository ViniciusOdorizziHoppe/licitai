import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, FileText, Menu, X, Scale } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard', label: 'Favoritos', icon: Heart },
  { path: '/dashboard', label: 'Licitações', icon: FileText },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed',
          left: '1rem',
          top: '1rem',
          zIndex: 50,
          padding: '0.5rem',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          backdropFilter: 'blur(20px)',
          display: 'none',
        }}
        className="sidebar-toggle"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '240px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease-out',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
        }}
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            height: '64px',
            padding: '0 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Scale size={17} style={{ color: '#3b82f6' }} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#3b82f6' }}>Licit</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>AI</span>
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ marginTop: '0.75rem', padding: '0 0.75rem', flex: 1 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  marginBottom: '0.25rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                  background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-out',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.6875rem',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          © 2025 LicitAI
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
        />
      )}

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; }
          .sidebar { transform: translateX(-100%); }
          .sidebar-open { transform: translateX(0) !important; }
        }
        @media (min-width: 769px) {
          .sidebar { position: static !important; }
        }
      `}</style>
    </>
  );
}
