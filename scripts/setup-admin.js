const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@usamavet.com';
  const password = 'AdminPassword123!';

  console.log('Seeding initial Super Admin...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin already exists with email:', email);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Super Admin created successfully!');
  console.log('--------------------------------------------------');
  console.log(`Login URL: /admin/login`);
  console.log(`Email:     ${email}`);
  console.log(`Password:  ${password}`);
  console.log('--------------------------------------------------');
  console.log('⚠️ IMPORTANT: Please change this password after your first login!');
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
