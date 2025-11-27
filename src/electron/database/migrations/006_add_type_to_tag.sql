-- 006_add_type_to_tag.sql

ALTER TABLE tags
ADD COLUMN category TEXT NOT NULL
    DEFAULT 'general'
    CHECK (category IN ('copyright', 'character', 'artist', 'general', 'meta'));

