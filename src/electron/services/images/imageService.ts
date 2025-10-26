import { db } from '../../database/index.js'

export const ImageService = {
    add: (filename: string) => {
        const prepare = db.prepare('INSERT INTO images (id, artist_id, group_id) VALUES (?, ?, ?)')
        prepare.run(filename, null, null)
    },
    delete: (id: string) => {
        db.prepare('DELETE FROM images WHERE id = ?').run(id)
    },
}
