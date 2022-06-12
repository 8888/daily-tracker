import { DBConnection } from '../database/db';

export type Note = {
  id: string,
  body: string,
  created_at: string,
  updated_at: string,
};

export async function indexNotes(db: DBConnection) {
  const sql = `select * from note;`;
  return db.query(sql);
}

export async function createNote(body: string, db: DBConnection) {
  const sql = `
    insert into note (body, created_at, updated_at)
    values (:body, current_timestamp, current_timestamp);
  `;
  const params = { body };

  return db.query(sql, params);
}
