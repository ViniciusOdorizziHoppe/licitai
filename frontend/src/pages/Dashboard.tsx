import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CardLicitacao from '../components/CardLicitacao';
import api from '../lib/api';
import { toast } from 'sonner';
import { Search, Filter, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  modalidade: string | null;
}

export default function Dashboard() {
  const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uf, setUf] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const limit = 12;

  const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  const categorias = ['TI', 'OBRAS', 'SAUDE', 'EDUCACAO', 'ALIMENTACAO', 'SERVICOS', 'EQUIPAMENTOS', 'OUTROS'];
  const modalidades = ['Pregão Eletrônico', 'Concorrência', 'Dispensa', 'Inexigibilidade', 'Convite', 'Credenciamento'];

  async function fetchData(resetPage = true) {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);
      const params: any = { page: currentPage, limit };
      if (search) params.search = search;
      if (uf) params.uf = uf;
      if (categoria) params.categoria = categoria;
      if (modalidade) params.modalidade = modalidade;
      const res = await api.get('/licitacoes', { params });
      setLicitacoes(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Erro ao carregar licitações');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await api.post('/licitacoes/sync');
      toast.success(res.data.message || 'Sincronizado!');
      fetchData(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao sincronizar');
    } finally {
      setSyncing(false);
    }
  }

  function handleSearch() {
    fetchData(true);
  }

  return (
    <Layout>
      {/* ─── Page Header ─── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
        className="animate-fade-in"
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '0.25rem',
            }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)' }}>
              {licitacoes.length > 0 ? `${licitacoes.length} licitações encontradas` : 'Nenhuma licitação carregada'}
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
          >
            {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Sincronizar PNCP
          </button>
        </div>
      </div>

      {/* ─── Filters ─── */}
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          animationDelay: '0.1s',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ display: 'flex', flex: '1 1 280px', gap: '0.5rem' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar por objeto, órgão, palavra-chave..."
              className="glass-input"
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSearch}
              className="btn-glass"
              style={{ flexShrink: 0 }}
            >
              <Search size={15} />
              <span style={{ display: 'none' }} className="search-label">Buscar</span>
            </button>
          </div>

          {/* Selects */}
          <select
            value={uf}
            onChange={(e) => { setUf(e.target.value); setPage(1); fetchData(true); }}
            className="glass-select"
          >
            <option value="">Todas UFs</option>
            {ufs.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <select
            value={categoria}
            onChange={(e) => { setCategoria(e.target.value); setPage(1); fetchData(true); }}
            className="glass-select"
          >
            <option value="">Categorias</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={modalidade}
            onChange={(e) => { setModalidade(e.target.value); setPage(1); fetchData(true); }}
            className="glass-select"
          >
            <option value="">Modalidades</option>
            {modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* ─── Grid ─── */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '220px' }} />
          ))}
        </div>
      ) : licitacoes.length === 0 ? (
        <div
          className="glass-card animate-fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 2rem',
            textAlign: 'center',
          }}
        >
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
            <Filter size={24} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
          <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.375rem' }}>
            Nenhuma licitação encontrada
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)' }}>
            Tente ajustar os filtros ou sincronizar com o PNCP
          </p>
        </div>
      ) : (
        <div
          className="stagger-children"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {licitacoes.map((l) => (
            <div key={l.id} className="animate-fade-in-up">
              <CardLicitacao licitacao={l} />
            </div>
          ))}
        </div>
      )}

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '2rem',
          }}
          className="animate-fade-in"
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn-glass"
          >
            <ChevronLeft size={15} />
            Anterior
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 500,
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{page}</span>
            <span>de</span>
            <span>{totalPages}</span>
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="btn-glass"
          >
            Próxima
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Responsive inline style */}
      <style>{`
        @media (min-width: 640px) {
          .search-label { display: inline !important; }
        }
      `}</style>
    </Layout>
  );
}
