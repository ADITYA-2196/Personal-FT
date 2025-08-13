import 'dotenv/config';
import { query } from './db.js';
import fs from 'fs';

async function run() {
  const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf-8');
  await query(schema);

  const seed = fs.readFileSync(new URL('./seed.sql', import.meta.url), 'utf-8');
  await query(seed);
  console.log(`Database seeded. Demo users:
  admin@pft.dev / password123
  user@pft.dev / password123
  viewer@pft.dev / password123`);
  process.exit(0);
}
run().catch(e => { 
  console.error(e);
  process.exit(1);
});
