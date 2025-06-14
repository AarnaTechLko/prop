// src/db/client.ts

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
 database: 'landos',
});

export const db = drizzle(pool);
