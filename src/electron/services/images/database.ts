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
    const query = `
        SELECT i.*,
            COALESCE(
                json_group_array(json_object('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), json('[]')
            ) AS tags 
        FROM images i
        LEFT JOIN image_tags it ON i.id = it.image_id
        LEFT JOIN tags t ON t.id = it.tag_id
        GROUP BY i.id
        ORDER BY i.id;
    `
    return db.prepare(query).all()
}
