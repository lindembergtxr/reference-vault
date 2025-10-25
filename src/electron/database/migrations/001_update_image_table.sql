-- 001_update_image_table.sql

ALTER TABLE images
DROP COLUMN title;

ALTER TABLE images
DROP COLUMN path;