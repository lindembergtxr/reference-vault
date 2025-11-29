import { db } from '../../database/index.js'

import { adaptInternalTabToDB } from './tags.adapters.js'
import { type TagDB } from './tags.types.js'

export async function getAllTags() {
    return db.prepare('SELECT * FROM tags ORDER BY id ASC').all() as InternalTag[]
}

export async function createTag(tag: TagDB, context = db) {
    const statement = context.prepare(`
        INSERT INTO tags (id, name, franchise, category)
        VALUES (@id, @name, @franchise, @category)
        ON CONFLICT(name, franchise, category) DO UPDATE SET id = id
        RETURNING id;
    `)
    const row = statement.get(tag)

    if (!row) throw new Error('Failed to insert or retrieve tag')

    return (row as { id: string }).id
}

export async function linkImageToTag(imageId: string, tagId: string, context = db) {
    const query = `
        INSERT INTO image_tags (image_id, tag_id)
        VALUES (@imageId, @tagId)
        ON CONFLICT(image_id, tag_id) DO NOTHING;
    `
    return context.prepare(query).run({ imageId, tagId })
}

export async function createTags(tags: InternalTagNew[]) {
    const query = `
        INSERT INTO tags (id, name, franchise, category)
        VALUES (@id, @name, @franchise, @category)
        ON CONFLICT(name, franchise, category)
            DO UPDATE SET id = id
            RETURNING id;
    `
    const insertTags = db.transaction((tags: InternalTagNew[]) => {
        const statement = db.prepare(query)
        const ids: string[] = []

        for (const tag of tags) {
            const dbTag = adaptInternalTabToDB(tag)
            const row = statement.get(dbTag) as { id: string }
            ids.push(row.id)
        }

        return ids
    })

    return insertTags(tags)
}

export async function attachTagsToImage(image: InternalImage) {
    const insert = db.prepare(`
        INSERT INTO image_tags (image_id, tag_id)
        VALUES (@imageId, @tagId)
        ON CONFLICT(image_id, tag_id) DO NOTHING;
    `)

    const transaction = db.transaction(() => {
        for (const tag of image.tags) insert.run({ imageId: image.id, tagId: tag.id })
    })

    transaction()
}

export async function updateImageTags(image: InternalImage) {
    const transaction = db.transaction(() => {
        createTags(image.tags)
        attachTagsToImage(image)
    })
    transaction()
}
