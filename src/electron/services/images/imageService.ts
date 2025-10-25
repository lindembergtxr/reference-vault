import { db } from '../../database/index.js'

export const ImageService = {
    add: (filename: string) => {
        db.prepare(
            'INSERT INTO images (id, artist_id, group_id) VALUES (?, ?, ?)',
        ).run(filename, null, null)
    },
    delete: (id: string) => {
        db.prepare('DELETE FROM images WHERE id = ?').run(id)
    },
}
