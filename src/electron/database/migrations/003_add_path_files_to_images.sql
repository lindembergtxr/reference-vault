-- 003_add_path_files_to_images.sql

ALTER TABLE images
ADD COLUMN thumbnail_path VARCHAR(256);

ALTER TABLE images
ADD COLUMN image_path VARCHAR(256);
