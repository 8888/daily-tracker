import { DBConnection } from '../database/db';

export type Note = {
  id: string,
  body: string,
  created_at: string,
  updated_at: string,
};

export function createNote(body: string, db: DBConnection): Note {
  return {id: '', body: '', created_at: '', updated_at: ''}
}
