import pLimit from 'p-limit'
import { db } from '../../database/index.js'

export const upsertImage = (image: InternalImage) => {
    const { id, thumbnail, imagePath, groupId, situation } = image

    const prepare = db.prepare(`
        INSERT INTO images (id, thumbnail_path, image_path, group_id, situation)
        VALUES (@id, @thumbnailPath, @imagePath, @groupId, @situation)
        ON CONFLICT(id) DO UPDATE SET
            thumbnail_path = excluded.thumbnail_path,
            image_path = excluded.image_path,
            group_id = excluded.group_id,
            situation = excluded.situation
    `)
    prepare.run({ id, imagePath, groupId, situation, thumbnailPath: thumbnail.path })
}

export const deleteImage = (id: string) => {
    db.prepare('DELETE FROM images WHERE id = ?').run(id)
}

export const batchAddImages = (images: InternalImage[]) => {
    const concurrency = Number(process.env.VITE_CONCURRENCY_LIMIT) || 5
    const limit = pLimit(concurrency)

    const promises = images.map((image) =>
        limit(async () => {
            upsertImage(image)
            return image
        })
    )
    return Promise.allSettled(promises)
}

export const getTemporaryFiles = () => {
    const query = `
        SELECT i.*,
            COALESCE(
                json_group_array(json_object('id', t.id)) FILTER (WHERE t.id IS NOT NULL), json('[]')
            ) AS tags 
        FROM images i
        LEFT JOIN image_tags it ON i.id = it.image_id
        LEFT JOIN tags t ON t.id = it.tag_id
        WHERE i.situation = 'pending'
        GROUP BY i.id
        ORDER BY i.id;
    `
    return db.prepare(query).all()
}

export const getCommitedFiles = () => {
    const query = `
        SELECT i.*,
            COALESCE(
                json_group_array(json_object('id', t.id)) FILTER (WHERE t.id IS NOT NULL), json('[]')
            ) AS tags 
        FROM images i
        LEFT JOIN image_tags it ON i.id = it.image_id
        LEFT JOIN tags t ON t.id = it.tag_id
        WHERE i.situation = 'committed'
        GROUP BY i.id
        ORDER BY i.id;
    `
    return db.prepare(query).all()
}
