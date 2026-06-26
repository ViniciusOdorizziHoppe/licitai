import { Link } from 'react-router-dom';
import { Scale, CheckCircle, Zap, Shield, ArrowRight, Search, FileText, BarChart3, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: '100dvh', background: '#000', color: 'rgba(255,255,255,0.85)', overflow: 'hidden' }}>
      {/* ─── Navbar ─── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          height: '72px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={22} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#3b82f6' }}>Licit</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/login"
            className="btn-glass"
            style={{ fontSize: '0.8125rem' }}
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="btn-primary"
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
          >
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section
        className="spotlight"
        style={{
          position: 'relative',
          padding: '10rem 1.5rem 6rem',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          {/* Badge */}
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 1rem',
              borderRadius: '100px',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#60a5fa',
              marginBottom: '2rem',
            }}
          >
            <Zap size={14} />
            Monitoramento de licitações com IA
          </div>

          {/* Headline */}
          <h1
            className="heading-hero animate-fade-in-up"
            style={{ marginBottom: '1.5rem', animationDelay: '0.1s' }}
          >
            Encontre{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              licitações
            </span>
            {' '}antes da concorrência
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
              animationDelay: '0.2s',
            }}
          >
            A LicitAI monitora o PNCP e resume editais com inteligência artificial.
            Sua empresa encontra oportunidades em minutos, não em horas.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              animationDelay: '0.3s',
            }}
          >
            <Link to="/register" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
              Começar grátis
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost" style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <RevealSection>
        <section style={{ padding: '4rem 1.5rem' }}>
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { value: '50+', label: 'editais por mês', icon: FileText },
              { value: 'PNCP', label: '+ BEC/SP integrados', icon: Search },
              { value: '10s', label: 'para resumir um edital', icon: Zap },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                <stat.icon size={24} style={{ color: '#3b82f6', margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px', color: 'rgba(255,255,255,0.9)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ─── How It Works ─── */}
      <RevealSection>
        <section className="spotlight" style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 className="heading-section" style={{ marginBottom: '1rem' }}>
                Como funciona
              </h2>
              <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.4)', maxWidth: '500px', margin: '0 auto' }}>
                Três passos simples para encontrar oportunidades de licitação
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[
                {
                  step: '01',
                  icon: Search,
                  title: 'Monitoramento automático',
                  description: 'Conectamos diretamente ao PNCP e coletamos novos editais em tempo real, sem scraping instável.',
                },
                {
                  step: '02',
                  icon: BarChart3,
                  title: 'Resumo com IA',
                  description: 'Cada edital é analisado e resumido automaticamente: objeto, valor, prazo, requisitos e categoria.',
                },
                {
                  step: '03',
                  icon: Star,
                  title: 'Filtre e favorite',
                  description: 'Encontre exatamente as licitações que sua empresa pode disputar. Favorite e acompanhe o progresso.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1.25rem',
                      fontSize: '3.5rem',
                      fontWeight: 900,
                      color: 'rgba(255,255,255,0.03)',
                      letterSpacing: '-2px',
                      lineHeight: 1,
                    }}
                  >
                    {item.step}
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <item.icon size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.625rem', color: 'rgba(255,255,255,0.85)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ─── Pricing ─── */}
      <RevealSection>
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 className="heading-section" style={{ marginBottom: '1rem' }}>
                Planos
              </h2>
              <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.4)', maxWidth: '500px', margin: '0 auto' }}>
                Escolha o plano ideal para o tamanho do seu negócio
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                alignItems: 'stretch',
              }}
            >
              {/* Free */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Free</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1.5rem' }}>
                  R$ 0
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '2rem', flex: 1 }}>
                  {['Acesso ao dashboard', 'Filtros básicos', '20 licitações/mês'].map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', padding: '0.375rem 0' }}>
                      <CheckCircle size={15} style={{ color: '#4ade80', flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn-ghost" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  Começar
                </Link>
              </div>

              {/* Pro — highlighted */}
              <div
                className="glass-card-glow"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '0.25rem 1rem',
                    borderRadius: '0 0 10px 10px',
                    background: '#3b82f6',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Mais popular
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '0.5rem' }}>Pro</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem' }}>
                  R$ 97
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>
                  por mês
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '2rem', flex: 1 }}>
                  {['Licitações ilimitadas', 'Filtros avançados', 'Favoritos e checklist', 'Resumos com IA'].map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', padding: '0.375rem 0' }}>
                      <CheckCircle size={15} style={{ color: '#4ade80', flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn-primary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  Assinar
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Business */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Business</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem' }}>
                  R$ 297
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>
                  por mês
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '2rem', flex: 1 }}>
                  {['Tudo do Pro', 'Alertas por email', 'Relatórios exportáveis', 'Suporte prioritário'].map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', padding: '0.375rem 0' }}>
                      <CheckCircle size={15} style={{ color: '#4ade80', flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn-ghost" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  Assinar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ─── CTA Final ─── */}
      <RevealSection>
        <section className="spotlight" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <h2 className="heading-section" style={{ marginBottom: '1.25rem' }}>
              Pronto para vender<br />para o governo?
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Comece a monitorar licitações gratuitamente. Sem cartão de crédito.
            </p>
            <Link to="/register" className="btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
              Criar conta grátis
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </RevealSection>

      {/* ─── Footer ─── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Scale size={16} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: '#3b82f6' }}>Licit</span>AI
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.22)' }}>
          Monitoramento de licitações públicas brasileiras com inteligência artificial.
        </p>
      </footer>
    </div>
  );
}
