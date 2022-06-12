import { DB } from '../database/db.local';
import * as note from './note';

export const main = {
  db: new DB(),
  note,
};
