import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/server/schema';
import * as dotenv from "dotenv"

dotenv.config({
  path: ".env.local",
})

// const sql = neon(process.env.POSTGRES_URL!);
const sql = neon("postgresql://neondb_owner:oJKVS07Dgjku@ep-aged-mode-a5s47m0q-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require");
export const db = drizzle(sql, {schema, logger:true});