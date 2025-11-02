-- 004_fix_situation_typo.sql

ALTER TABLE images DROP COLUMN situation;

ALTER TABLE images
ADD COLUMN situation TEXT NOT NULL
    DEFAULT 'pending'
    CHECK (situation IN ('pending', 'committed'));