import prisma from '../../utils/prisma';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'saurabh@gmail.com' },
  });
}
main().catch(console.error);