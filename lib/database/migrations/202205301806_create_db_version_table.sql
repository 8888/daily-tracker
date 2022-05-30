CREATE TABLE db_version (
  id SERIAL PRIMARY KEY,
  version_date TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
