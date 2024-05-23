import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = global.process.env.PG_DB_URL as string;

//db singleton so we don't recreate connection
let db: PostgresJsDatabase<typeof schema> = singleton('db', () => {
  if (!process.env.PG_DB_URL) {
    throw new Error('Missing DATABASE_URL');
  }
  const queryClient = postgres(connectionString);
  return drizzle(queryClient, { schema });
});

export function singleton<Value>(name: string, value: () => Value): Value {
  const yolo = global as any;
  yolo.__singletons ??= {};
  yolo.__singletons[name] ??= value();
  return yolo.__singletons[name];
}

export { db };
