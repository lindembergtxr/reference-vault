PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    artist_id TEXT,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL,
    UNIQUE(name, artist_id)
);

CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    group_id TEXT,
    thumbnail_path TEXT NOT NULL,
    image_path TEXT NOT NULL,
    situation TEXT NOT NULL DEFAULT 'pending'
        CHECK (situation IN ('pending', 'committed', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    franchise TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'general'
        CHECK (category IN ('copyright','character','artist','general','meta')),
    UNIQUE(name, franchise, category)
);

CREATE TABLE IF NOT EXISTS image_tags (
    image_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (image_id, tag_id),
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    run_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);