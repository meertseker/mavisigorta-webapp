#!/usr/bin/env node
// Yardımcı script: ADMIN_PASSWORD_HASH ve ADMIN_PASSWORD_SALT değerlerini üretir.
// Kullanım: node scripts/hash-admin-password.mjs "ŞifrenizBuraya"
import { createHash, randomBytes } from 'crypto';

const password = process.argv[2];
if (!password) {
  console.error('Kullanım: node scripts/hash-admin-password.mjs "ŞifrenizBuraya"');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = createHash('sha256').update(password + salt).digest('hex');
const sessionSecret = randomBytes(32).toString('hex');

console.log('# .env.local dosyanıza ekleyin:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_PASSWORD_SALT=${salt}`);
console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
