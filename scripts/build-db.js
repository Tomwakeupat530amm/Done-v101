const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building production database template...');

const prodDbPath = path.join(__dirname, '../prisma/prod.db');

if (fs.existsSync(prodDbPath)) {
  fs.unlinkSync(prodDbPath);
  console.log('Removed existing prod.db');
}

try {
  // Push the schema to create an empty database with tables
  console.log('Pushing Prisma schema to prod.db...');
  execSync('npx prisma db push --skip-generate', {
    env: { ...process.env, DATABASE_URL: 'file:./prod.db' },
    stdio: 'inherit'
  });

  // Seed the initial data required for the app
  console.log('Seeding initial data...');
  execSync('npx tsx prisma/seed.ts', {
    env: { ...process.env, DATABASE_URL: 'file:./prod.db' },
    stdio: 'inherit'
  });

  console.log('✅ Production database template generated at prisma/prod.db');
} catch (error) {
  console.error('❌ Failed to build production database:', error.message);
  process.exit(1);
}
