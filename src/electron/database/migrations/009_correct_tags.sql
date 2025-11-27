-- 009_correct_tags.sql

CREATE TABLE IF NOT EXISTS tags_new (
    id TEXT NOT NULL,
    franchise VARCHAR(256),
    category TEXT NOT NULL
        DEFAULT 'general'
        CHECK (category IN ('copyright', 'character', 'artist', 'general', 'meta'))
);

INSERT INTO tags_new (id, franchise, category)
SELECT id, franchise, category FROM tags;

DROP TABLE tags;

ALTER TABLE tags_new RENAME TO tags;

CREATE UNIQUE INDEX IF NOT EXISTS unique_tag_combination
ON tags (id, franchise, category);