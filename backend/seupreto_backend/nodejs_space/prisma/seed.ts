import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('johndoe123', 10);

  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      nome: 'Admin',
      email: 'john@doe.com',
      senha: senhaHash,
      role: Role.ADMIN,
      telefone: '(11) 99999-0000',
    },
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
