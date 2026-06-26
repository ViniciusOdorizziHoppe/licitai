import { Router } from 'express';
import { prisma } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const favoritos = await prisma.favorito.findMany({
      where: { userId: req.user!.id },
      include: { licitacao: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favoritos.map(f => f.licitacao));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { licitacaoId } = req.body;
    if (!licitacaoId) {
      res.status(400).json({ error: 'licitacaoId obrigatório' });
      return;
    }
    const favorito = await prisma.favorito.create({
      data: { userId: req.user!.id, licitacaoId },
    });
    res.json(favorito);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao favoritar' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.favorito.deleteMany({
      where: { userId: req.user!.id, licitacaoId: req.params.id },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover favorito' });
  }
});

export { router as favoritosRouter };
