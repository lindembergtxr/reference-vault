-- 008_add_constraint_to_tag.sql

CREATE UNIQUE INDEX IF NOT EXISTS unique_tag_combination
ON tags (id, franchise, category);