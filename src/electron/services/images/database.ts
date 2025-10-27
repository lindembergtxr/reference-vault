import pLimit from 'p-limit'
import { db } from '../../database/index.js'

export const addImage = (image: InternalImage) => {
    const { id, thumbnailPath, imagePath, artistId, groupId } = image

    const prepare = db.prepare(
        'INSERT INTO images (id, thumbnail_path, image_path, artist_id, group_id) VALUES (?, ?, ?, ?, ?)',
    )
    prepare.run(id, thumbnailPath, imagePath, artistId, groupId)
}

export const deleteImage = (id: string) => {
    db.prepare('DELETE FROM images WHERE id = ?').run(id)
}

export const batchAddImages = (images: InternalImage[]) => {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    const promises = images.map((image) =>
        limit(async () => {
            addImage(image)
            return image
        }),
    )
    return Promise.allSettled(promises)
}

export const getTemporaryFiles = () => {
    return db.prepare(`SELECT * FROM images WHERE situation = 'pending'`).all()
}
