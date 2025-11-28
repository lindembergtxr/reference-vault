import { adaptInternalTabToDB } from '../../adapters/tags.js'
import { db } from '../../database/index.js'
import { TagDB } from '../../types/database.js'

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
    const statement = context.prepare(`
        INSERT INTO image_tags (image_id, tag_id)
        VALUES (@imageId, @tagId)
        ON CONFLICT(image_id, tag_id) DO NOTHING;
    `)
    return statement.run({ imageId, tagId })
}

export async function batchCreateTags(tags: InternalTagNew[]) {
    const insertTags = db.transaction((tags: InternalTagNew[]) => {
        const statement = db.prepare(`
            INSERT INTO tags (id, name, franchise, category)
            VALUES (@id, @name, @franchise, @category)
            ON CONFLICT(name, franchise, category) DO NOTHING;
        `)
        const inserted: string[] = []

        for (const tag of tags) {
            const dbTag = adaptInternalTabToDB(tag)
            const result = statement.run(dbTag)

            if (result.changes > 0) inserted.push(dbTag.id)
        }
        return inserted
    })

    return insertTags(tags)
}

export async function batchLinkImageToTags(image: InternalImage) {
    const insert = db.prepare(`
        INSERT INTO image_tags (image_id, tag_id)
        VALUES (@imageId, @tagId)
        ON CONFLICT(image_id, tag_id) DO NOTHING;
    `)

    const transaction = db.transaction(() => {
        for (const tag of image.tags) insert.run(image.id, tag.id)
    })

    transaction()
}

export async function updateImageTags(image: InternalImage) {
    const transaction = db.transaction(() => {
        batchCreateTags(image.tags)
        batchLinkImageToTags(image)
    })
    transaction()
}
