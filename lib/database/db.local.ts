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
    const formatted = this.parse(sql, params as {});
    const { rows } = await this.pool.query(formatted.sql, formatted.params);
    // match return signature of data-api-client
    return { records: rows };
  }

  /**
   * This is needed because local PSQL and Serverless Aurora use different connection libraries
   * Each connection library has sql in a different format
   * This will take the Aurora format (prod) and convert it to PG (dev)
   *
   * Aurora using data-api-client format:
   * let insert = await data.query(
   *    `INSERT INTO myTable (name,age,has_curls) VALUES(:name,:age,:curls)`,
   *    { name: 'Greg',   age: 18,  curls: false }
   * )
   * https://github.com/jeremydaly/data-api-client
   *
   * PSQL using node-postgres format:
   * pool.query('SELECT * FROM users WHERE id = $1', [1]
   * https://node-postgres.com/features/pooling
   * @param sql string in the format of Auora
   * @param params key value pairs, key maps to :identifier in sql string
   */
  public parse(sql: string, params?: { [key: string]: any }) {
    if (params) {
      const split = sql.split(':');
      const regex = /[A-Za-z0-9]+/;
      let formattedParams = [];

      for (let i = 1; i < split.length; i++) {
        // index 0 is always before the params start
        const param = split[i].match(regex)![0];
        split[i] = split[i]!.replace(param, `$${i}`);
        formattedParams.push(params[param])
      }

      return { sql: split.join(''), params: formattedParams };
    } else {
      return { sql, params };
    }
  }
}
