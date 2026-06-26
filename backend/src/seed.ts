import { prisma } from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  const passwordHash = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@licitai.com' },
    update: {},
    create: {
      email: 'demo@licitai.com',
      passwordHash,
      name: 'Usuário Demo',
      plan: 'FREE',
    },
  });
  console.log('Seed user:', user.email);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
