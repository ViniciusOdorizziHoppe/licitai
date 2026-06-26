import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BadgeCategoria from '../components/BadgeCategoria';
import api from '../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  ExternalLink,
  Heart,
  Loader2,
  CheckCircle2,
  Circle,
  Sparkles,
} from 'lucide-react';

interface Licitacao {
  id: string;
  pncpId: string;
  titulo: string;
  objeto: string;
  orgao: string;
  cnpjOrgao: string | null;
  modalidade: string | null;
  valorEstimado: number | null;
  dataAbertura: string | null;
  dataEncerramento: string | null;
  situacao: string | null;
  uf: string | null;
  municipio: string | null;
  categoria: string | null;
  resumo: string | null;
  palavrasChave: string | null;
  numeroEdital: string | null;
  linkPncp: string | null;
  createdAt: string;
}

export default function LicitacaoDetail() {
  const { id } = useParams<{ id: string }>();
  const [licitacao, setLicitacao] = useState<Licitacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriting, setFavoriting] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  // Checklist mock (para MVP — depois virá do backend)
  const checklist = [
    'Certidão negativa de débitos (CND)',
    'Cartão CNPJ atualizado',
    'Certidão negativa FGTS',
    'Certidão negativa da Receita Federal',
    'Certidão de regularidade fiscal estadual',
    'Registro no SICAF (se exigido)',
    'Proposta de preços assinada',
    'Declaração de habilitação',
  ];
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  async function fetchLicitacao() {
    setLoading(true);
    try {
      const res = await api.get(`/licitacoes/${id}`);
      setLicitacao(res.data);
      // Check if favorito (try/catch because user might not be logged in for demo)
      try {
        const favRes = await api.get('/favoritos');
        const favs = favRes.data || [];
        setIsFavorito(favs.some((f: any) => f.id === id));
      } catch {
        setIsFavorito(false);
      }
    } catch (err) {
      toast.error('Erro ao carregar licitação');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchLicitacao();
  }, [id]);

  async function toggleFavorito() {
    if (!licitacao) return;
    setFavoriting(true);
    try {
      if (isFavorito) {
        await api.delete(`/favoritos/${licitacao.id}`);
        setIsFavorito(false);
        toast.success('Removido dos favoritos');
      } else {
        await api.post('/favoritos', { licitacaoId: licitacao.id });
        setIsFavorito(true);
        toast.success('Adicionado aos favoritos');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar favorito');
    } finally {
      setFavoriting(false);
    }
  }

  function toggleCheck(index: number) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} style={{ color: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Layout>
    );
  }

  if (!licitacao) {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <FileText size={24} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
          <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
            Licitação não encontrada
          </p>
          <Link
            to="/dashboard"
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Voltar ao dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const valor = licitacao.valorEstimado
    ? `R$ ${licitacao.valorEstimado.toLocaleString('pt-BR')}`
    : 'Valor não informado';
  const abertura = licitacao.dataAbertura
    ? format(new Date(licitacao.dataAbertura), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    : 'Não informada';
  const encerramento = licitacao.dataEncerramento
    ? format(new Date(licitacao.dataEncerramento), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    : 'Não informada';
  const progresso = Math.round((checkedItems.size / checklist.length) * 100);

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
        {/* ─── Back + Actions ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <ArrowLeft size={15} />
            Voltar ao dashboard
          </Link>
          <button
            onClick={toggleFavorito}
            disabled={favoriting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease-out',
              border: '1px solid',
              ...(isFavorito
                ? {
                    background: 'rgba(244, 63, 94, 0.08)',
                    color: '#fb7185',
                    borderColor: 'rgba(244, 63, 94, 0.2)',
                  }
                : {
                    background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.5)',
                    borderColor: 'rgba(255,255,255,0.06)',
                  }),
            }}
          >
            {favoriting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Heart size={15} style={{ fill: isFavorito ? '#fb7185' : 'none' }} />
            )}
            {isFavorito ? 'Favorito' : 'Favoritar'}
          </button>
        </div>

        {/* ─── Header Card ─── */}
        <div
          className="glass-card-glow"
          style={{ padding: '1.75rem', marginBottom: '1.5rem' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BadgeCategoria categoria={licitacao.categoria || 'OUTROS'} />
            {licitacao.uf && (
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                {licitacao.uf}
              </span>
            )}
            {licitacao.modalidade && (
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                {licitacao.modalidade}
              </span>
            )}
          </div>
          <h1 style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
          }}>
            {licitacao.titulo}
          </h1>
          {licitacao.resumo && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
            }}>
              <Sparkles size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.125rem' }} />
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
                {licitacao.resumo}
              </p>
            </div>
          )}
        </div>

        {/* ─── Content Grid ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="detail-grid">
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
                  <Building2 size={14} /> Órgão
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                  {licitacao.orgao || 'Não informado'}
                </p>
                {licitacao.cnpjOrgao && (
                  <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.22)', marginTop: '0.375rem' }}>
                    CNPJ: {licitacao.cnpjOrgao}
                  </p>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
                  <DollarSign size={14} style={{ color: '#4ade80' }} /> Valor estimado
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4ade80' }}>{valor}</p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
                  <Calendar size={14} style={{ color: '#fbbf24' }} /> Abertura
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fbbf24' }}>{abertura}</p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
                  <Calendar size={14} style={{ color: '#fb7185' }} /> Encerramento
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fb7185' }}>{encerramento}</p>
              </div>
            </div>

            {/* Objeto completo */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '0.75rem',
              }}>
                <FileText size={18} style={{ color: '#3b82f6' }} />
                Objeto da licitação
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                {licitacao.objeto}
              </p>
            </div>

            {/* Link PNCP */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '0.75rem',
              }}>
                Link oficial
              </h2>
              <a
                href={licitacao.linkPncp || `https://pncp.gov.br/app/editais/${licitacao.pncpId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
              >
                <ExternalLink size={15} />
                Ver no PNCP
              </a>
            </div>
          </div>

          {/* ─── Sidebar: Checklist ─── */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '1rem',
            }}>
              Checklist de documentos
            </h2>

            {/* Progress */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>Progresso</span>
                <span style={{ fontWeight: 700, color: '#4ade80' }}>{progresso}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progresso}%` }} />
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {checklist.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.5rem 0.625rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.8125rem',
                    transition: 'background 0.2s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {checkedItems.has(i) ? (
                    <CheckCircle2 size={16} style={{ color: '#4ade80', flexShrink: 0, marginTop: '1px' }} />
                  ) : (
                    <Circle size={16} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0, marginTop: '1px' }} />
                  )}
                  <span
                    style={{
                      color: checkedItems.has(i) ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)',
                      textDecoration: checkedItems.has(i) ? 'line-through' : 'none',
                      lineHeight: 1.4,
                    }}
                  >
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (min-width: 768px) {
          .detail-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}
