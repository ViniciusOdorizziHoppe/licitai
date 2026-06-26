import axios from 'axios';

const PNCP_BASE = 'https://pncp.gov.br/api/consulta/v1';

export interface PncpContratacao {
  numeroControlePNCP: string;
  numeroCompra: string;
  objetoCompra?: string;
  valorTotalEstimado?: number;
  valorTotalHomologado?: number;
  orgaoEntidade?: {
    cnpj?: string;
    razaoSocial?: string;
  };
  unidadeOrgao?: {
    nomeUnidade?: string;
    municipioNome?: string;
    ufSigla?: string;
  };
  dataAberturaProposta?: string;
  dataEncerramentoProposta?: string;
  situacaoCompraNome?: string;
  modalidadeNome?: string;
  modalidadeId?: number;
  linkSistemaOrigem?: string;
  anoCompra?: number;
  sequencialCompra?: number;
}

export async function fetchContratacoesPncp(modalidadeId = null, page = 1, size = 50): Promise<PncpContratacao[]> {
  try {
    const hoje = new Date();
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(hoje.getFullYear() - 1);
    const dataInicial = umAnoAtras.toISOString().slice(0, 10).replace(/-/g, '');
    const dataFinal = hoje.toISOString().slice(0, 10).replace(/-/g, '');

    const params: any = {
      dataInicial,
      dataFinal,
      pagina: page,
      tamanhoPagina: Math.max(10, size),
    };
    if (modalidadeId) params.codigoModalidadeContratacao = modalidadeId;

    const response = await axios.get(`${PNCP_BASE}/contratacoes/publicacao`, {
      params,
      timeout: 30000,
    });
    return response.data?.data || [];
  } catch (err: any) {
    console.error('Erro ao buscar contratacoes PNCP:', err?.response?.data || err?.message || err);
    return [];
  }
}

export async function fetchContratacaoById(pncpId: string): Promise<PncpContratacao | null> {
  try {
    const parts = pncpId.split('-');
    if (parts.length >= 3) {
      const cnpj = parts[0];
      const ano = parts[1];
      const sequencial = parts[2].split('/')[0];
      const response = await axios.get(`https://pncp.gov.br/api/consulta/v1/orgaos/${cnpj}/compras/${ano}/${sequencial}`, {
        timeout: 30000,
      });
      return response.data;
    }
    return null;
  } catch (err: any) {
    console.error('Erro ao buscar contratacao PNCP:', err?.response?.data || err?.message || err);
    return null;
  }
}

export function detectCategoria(objeto: string): string {
  const texto = (objeto || '').toLowerCase();
  if (texto.includes('software') || texto.includes('ti') || texto.includes('informática') || texto.includes('sistema') || texto.includes('licença') || texto.includes('computador') || texto.includes('servidor') || texto.includes('cloud')) return 'TI';
  if (texto.includes('obra') || texto.includes('construção') || texto.includes('reforma') || texto.includes('infraestrutura') || texto.includes('pavimentação') || texto.includes('edificação')) return 'OBRAS';
  if (texto.includes('saúde') || texto.includes('medicamento') || texto.includes('hospital') || texto.includes('equipamento médico') || texto.includes('ambulância')) return 'SAUDE';
  if (texto.includes('educação') || texto.includes('escola') || texto.includes('didático') || texto.includes('universidade') || texto.includes('livr')) return 'EDUCACAO';
  if (texto.includes('alimentação') || texto.includes('gêneros alimentícios') || texto.includes('merenda') || texto.includes('refeição') || texto.includes('alimento')) return 'ALIMENTACAO';
  if (texto.includes('serviço') || texto.includes('consultoria') || texto.includes('assessoria') || texto.includes('treinamento')) return 'SERVICOS';
  if (texto.includes('veículo') || texto.includes('automóvel') || texto.includes('caminhão') || texto.includes('máquina') || texto.includes('equipamento')) return 'EQUIPAMENTOS';
  return 'OUTROS';
}
export async function fetchAllContratacoesPncp(modalidadeId = 6, maxPages = 10, size = 100): Promise<PncpContratacao[]> {
  const all: PncpContratacao[] = [];
  for (let page = 1; page <= maxPages; page++) {
    try {
      const result = await fetchContratacoesPncp(null, page, size);
      if (!result || result.length === 0) break;
      all.push(...result);
      console.log(`Pagina ${page}: ${result.length} contratacoes (total: ${all.length})`);
    } catch (e) {
      console.error(`Erro pagina ${page}:`, e);
      break;
    }
  }
  return all;
}

export function gerarResumo(c: PncpContratacao): string {
  const objeto = c.objetoCompra || 'Objeto não informado';
  const orgao = c.orgaoEntidade?.razaoSocial || 'Órgão não informado';
  const modalidade = c.modalidadeNome || 'Modalidade não informada';
  const valor = c.valorTotalEstimado || c.valorTotalHomologado || 0;
  const valorFmt = valor > 0 ? `R$ ${valor.toLocaleString('pt-BR')}` : 'Valor não informado';
  const abertura = c.dataAberturaProposta ? new Date(c.dataAberturaProposta).toLocaleDateString('pt-BR') : 'Não informada';
  return `Oportunidade de ${modalidade.toLowerCase()} publicada por ${orgao}. Objeto: ${objeto}. Valor estimado: ${valorFmt}. Abertura de propostas em ${abertura}.`;
}

export function gerarPalavrasChave(c: PncpContratacao): string {
  const palavras: string[] = [];
  const texto = (c.objetoCompra || '').toLowerCase();
  const modalidade = (c.modalidadeNome || '').toLowerCase();
  const orgao = (c.orgaoEntidade?.razaoSocial || '').toLowerCase();
  const cidade = (c.unidadeOrgao?.municipioNome || '').toLowerCase();
  const uf = (c.unidadeOrgao?.ufSigla || '').toLowerCase();

  if (modalidade) palavras.push(modalidade);
  if (cidade) palavras.push(cidade);
  if (uf) palavras.push(uf);
  if (orgao) palavras.push(...orgao.split(' ').filter(w => w.length > 3).slice(0, 3));

  const objTokens = texto.split(/[\s,.;]+/).filter(w => w.length > 4).slice(0, 5);
  palavras.push(...objTokens);

  return [...new Set(palavras)].join(', ');
}
