import { db } from '../../database/index.js'
import * as fs from 'fs'
import * as fsAsync from 'fs/promises'
import { ImageDB } from './images.types.js'
import { getDestinationFolder } from '../../config/index.js'
import path from 'path'

type GetImageFilesArgs = {
    situation: InternalImage['situation']
    tagIds?: string[]
}
export function getImages({ situation, tagIds }: GetImageFilesArgs) {
    let query = `
        SELECT i.*,
            COALESCE(
                JSON_GROUP_ARRAY(
                    JSON_OBJECT('id', t.id, 'name', t.name, 'category', t.category, 'franchise', t.franchise)
                ) FILTER (WHERE t.id IS NOT NULL),
                json('[]')
            ) AS tags
        FROM images i
        LEFT JOIN image_tags it ON i.id = it.image_id
        LEFT JOIN tags t ON t.id = it.tag_id
        WHERE i.situation = ?
    `
    const params: (string | number)[] = [situation]

    if (tagIds && tagIds.length > 0) {
        query += `
            AND i.id IN (
                SELECT image_id
                FROM image_tags
                WHERE tag_id IN (${tagIds.map(() => '?').join(',')})
                GROUP BY image_id
                HAVING COUNT(DISTINCT tag_id) = ?
            )
        `
        params.push(...tagIds, tagIds.length)
    }

    query += 'GROUP BY i.id ORDER BY i.id;'

    return db.prepare(query).all(...params)
}

export function upsertImage(image: Omit<InternalImage, 'tags'>) {
    const query = `
        INSERT INTO images (id, thumbnail_path, image_path, group_id, situation)
        VALUES (@id, @thumbnailPath, @imagePath, @groupId, @situation)
        ON CONFLICT(id) DO UPDATE SET
            thumbnail_path = excluded.thumbnail_path,
            image_path = excluded.image_path,
            group_id = excluded.group_id,
            situation = excluded.situation
    `
    return db.prepare(query).run(image)
}

export function getTagsForImage(imageId: string) {
    const query = `
        SELECT t.id, t.name, t.category, t.franchise
        FROM image_tags it
        JOIN tags t ON t.id = it.tag_id
        WHERE it.image_id = ?;
    `
    return db.prepare(query).all(imageId) as InternalTag[]
}

export function deleteImage(id: string) {
    db.prepare('DELETE FROM images WHERE id = ?').run(id)
}

export function countCommittedImages() {
    const row = db
        .prepare(`SELECT COUNT(id) AS count FROM images WHERE situation = 'committed';`)
        .get() as { count: number }

    return row.count
}

export function countAllImages() {
    const row = db.prepare(`SELECT COUNT(id) AS count FROM images;`).get() as { count: number }

    return row.count
}

type LinkTagsToImageArgs = {
    imageId: string
    tags: InternalTagNew[]
}
export async function linkTagsToImage({ imageId, tags }: LinkTagsToImageArgs) {
    const insert = db.prepare(`
        INSERT INTO image_tags (image_id, tag_id)
        VALUES (@imageId, @tagId)
        ON CONFLICT(image_id, tag_id) DO NOTHING;
    `)
    const transaction = db.transaction(() => {
        for (const tag of tags) insert.run({ imageId, tagId: tag.id })
    })

    transaction()
}

type UnlinkTagsFromImageArgs = {
    imageId: string
    tags: InternalTagNew[]
}
export async function unlinkTagsFromImage({ imageId, tags }: UnlinkTagsFromImageArgs) {
    const insert = db.prepare(`
        DELETE FROM image_tags
        WHERE image_id = @imageId AND tag_id = @tagId
    `)
    const transaction = db.transaction(() => {
        for (const tag of tags) insert.run({ imageId, tagId: tag.id })
    })

    transaction()
}

export function getImagesIdsByTagIds(tagIds: string[]): { id: string }[] {
    const query = `
        SELECT DISTINCT i.id
        FROM images i
        INNER JOIN image_tags it ON it.image_id = i.id
        WHERE it.tag_id IN (${tagIds.map(() => '?').join(',')});
    `
    return db.prepare(query).all(...tagIds) as { id: string }[]
}

export async function generateImageDBReport() {
    const query = `
        SELECT id, image_path, thumbnail_path
        FROM images;
    `
    const dbImages = db.prepare(query).all() as ImageDB[]

    const broken = []

    for (const { id, image_path, thumbnail_path } of dbImages) {
        const imgExists = image_path ? fs.existsSync(image_path) : false
        const thumbExists = thumbnail_path ? fs.existsSync(thumbnail_path) : false

        if (!imgExists || !thumbExists) {
            broken.push({ id, missingImage: !imgExists, missingThumb: !thumbExists })
        }
    }
    return broken
}

export async function generateImageFileReport(folder: 'images' | 'thumbnails') {
    const folderPath = await getDestinationFolder(folder)

    const imageFiles = await fsAsync.readdir(folderPath)

    const broken: string[] = []

    const query = 'SELECT 1 FROM images WHERE id = ?;'
    const statement = db.prepare(query)

    for (const file of imageFiles) {
        if (file.startsWith('.')) continue

        const filename = path.basename(file)

        const ext = path.extname(file).toLowerCase()

        if (!['.jpg', '.webp', '.gif'].includes(ext)) continue

        const exists = statement.get(filename)

        if (!exists) broken.push(filename)
    }
    return broken
}
