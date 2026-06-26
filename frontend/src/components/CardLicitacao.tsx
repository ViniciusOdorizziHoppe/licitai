import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Building2, ArrowRight } from 'lucide-react';
import BadgeCategoria from './BadgeCategoria';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Licitacao {
  id: string;
  pncpId: string;
  titulo: string;
  objeto: string;
  orgao: string;
  valorEstimado: number | null;
  dataAbertura: string | null;
  categoria: string | null;
  uf: string | null;
  resumo: string | null;
}

export default function CardLicitacao({ licitacao }: { licitacao: Licitacao }) {
  const valor = licitacao.valorEstimado
    ? `R$ ${licitacao.valorEstimado.toLocaleString('pt-BR')}`
    : 'Valor não informado';

  const data = licitacao.dataAbertura
    ? format(new Date(licitacao.dataAbertura), 'dd/MM/yyyy', { locale: ptBR })
    : 'Data não informada';

  return (
    <Link
      to={`/licitacao/${licitacao.id}`}
      className="block"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="glass-card group"
        style={{
          padding: '1.5rem',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 0 60px rgba(255, 255, 255, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Header: Badge + UF */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <BadgeCategoria categoria={licitacao.categoria || 'OUTROS'} />
          {licitacao.uf && (
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
            }}>
              {licitacao.uf}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.4,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {licitacao.titulo}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {licitacao.resumo || licitacao.objeto}
        </p>

        {/* Meta info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
            <Building2 size={14} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {licitacao.orgao}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
              <DollarSign size={14} style={{ color: '#4ade80' }} />
              <span style={{ color: '#4ade80', fontWeight: 500 }}>{valor}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
              <Calendar size={14} style={{ color: '#fbbf24' }} />
              <span style={{ color: '#fbbf24', fontWeight: 500 }}>{data}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#3b82f6',
            transition: 'gap 0.3s ease-out',
          }}
        >
          Ver detalhes
          <ArrowRight size={14} style={{ transition: 'transform 0.3s ease-out' }} className="group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
