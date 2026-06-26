import { Router } from 'express';
import { prisma } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { fetchAllContratacoesPncp, detectCategoria, gerarResumo, gerarPalavrasChave } from '../services/pncp';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { page = '1', limit = '20', search, uf, categoria, modalidade, minValor, maxValor, dataInicio, dataFim } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { titulo: { contains: search as string } },
        { objeto: { contains: search as string } },
        { orgao: { contains: search as string } },
        { palavrasChave: { contains: search as string } },
      ];
    }
    if (uf) where.uf = { equals: (uf as string).toUpperCase() };
    if (categoria) where.categoria = { equals: categoria as string };
    if (modalidade) where.modalidade = { contains: modalidade as string };
    if (minValor || maxValor) {
      where.valorEstimado = {};
      if (minValor) where.valorEstimado.gte = parseFloat(minValor as string);
      if (maxValor) where.valorEstimado.lte = parseFloat(maxValor as string);
    }
    if (dataInicio || dataFim) {
      where.dataAbertura = {};
      if (dataInicio) where.dataAbertura.gte = new Date(dataInicio as string);
      if (dataFim) where.dataAbertura.lte = new Date(dataFim as string);
    }

    const [items, total] = await Promise.all([
      prisma.licitacao.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { dataAbertura: 'desc' },
      }),
      prisma.licitacao.count({ where }),
    ]);

    res.json({ data: items, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar licitações' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const licitacao = await prisma.licitacao.findUnique({ where: { id: req.params.id } });
    if (!licitacao) {
      res.status(404).json({ error: 'Licitação não encontrada' });
      return;
    }
    res.json(licitacao);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar licitação' });
  }
});

router.post('/sync', authMiddleware, async (_req, res) => {
  try {
    const contratacoes = await fetchAllContratacoesPncp(null, 20, 100);
    let count = 0;
    for (const c of contratacoes) {
      if (!c.numeroControlePNCP) continue;
      const existing = await prisma.licitacao.findUnique({ where: { pncpId: c.numeroControlePNCP } });
      if (existing) continue;

      const categoria = detectCategoria(c.objetoCompra || '');
      const resumo = gerarResumo(c);
      const palavrasChave = gerarPalavrasChave(c);
      const numeroEdital = c.numeroCompra || '';

      await prisma.licitacao.create({
        data: {
          pncpId: c.numeroControlePNCP,
          titulo: (c.objetoCompra || '').substring(0, 200),
          objeto: c.objetoCompra || '',
          orgao: c.orgaoEntidade?.razaoSocial || '',
          cnpjOrgao: c.orgaoEntidade?.cnpj || '',
          modalidade: c.modalidadeNome || '',
          valorEstimado: c.valorTotalEstimado || c.valorTotalHomologado || 0,
          dataAbertura: c.dataAberturaProposta ? new Date(c.dataAberturaProposta) : undefined,
          dataEncerramento: c.dataEncerramentoProposta ? new Date(c.dataEncerramentoProposta) : undefined,
          situacao: c.situacaoCompraNome || '',
          uf: c.unidadeOrgao?.ufSigla || '',
          municipio: c.unidadeOrgao?.municipioNome || '',
          categoria,
          resumo,
          palavrasChave,
          numeroEdital,
          linkPncp: c.linkSistemaOrigem || `https://pncp.gov.br/app/editais/${c.numeroControlePNCP}`,
        },
      });
      count++;
    }

    res.json({ message: `${count} licitações sincronizadas`, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao sincronizar' });
  }
});

router.get('/pncp/:pncpId', async (req, res) => {
  try {
    const { fetchContratacaoById } = await import('../services/pncp');
    const data = await fetchContratacaoById(req.params.pncpId);
    if (!data) {
      res.status(404).json({ error: 'Não encontrado no PNCP' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar PNCP' });
  }
});

export { router as licitacoesRouter };
