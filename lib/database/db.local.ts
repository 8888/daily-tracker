import { DBConnection } from './db';
import { Pool } from 'pg';

export class DB implements DBConnection {
  private pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dailytracker',
    password: 'postgres',
    port: 5432,
  });

  public async query(sql: string, params?: [] | unknown) {
    return 'hello';
  }
}
