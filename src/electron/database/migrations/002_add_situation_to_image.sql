-- 002_add_situation_to_image.sql

ALTER TABLE images
ADD COLUMN situation TEXT NOT NULL
    DEFAULT 'pending'
    CHECK (situation IN ('pending', 'commited'));