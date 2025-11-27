import { adaptInternalTabToDB } from '../../adapters/tags.js'
import { db } from '../../database/index.js'

export const getAllTags = () => {
    return db.prepare('SELECT * FROM tags ORDER BY id ASC').all() as InternalTag[]
}

export const createTag = (tag: InternalTag, context = db) => {
    const dbTag = adaptInternalTabToDB(tag)

    const statement = context.prepare(`
        INSERT INTO tags (id, franchise, category)
        VALUES (@id, @franchise, @category)
        ON CONFLICT(id) DO UPDATE SET
            franchise = excluded.franchise
            category = excluded.category
    `)
    return statement.run(dbTag)
}

export const linkImageToTag = (imageId: string, tagId: string, context = db) => {
    const statement = context.prepare(`
        INSERT INTO image_tags (image_id, tag_id)
        VALUES (@imageId, @tagId)
        ON CONFLICT(image_id, tag_id) DO NOTHING;
    `)
    return statement.run({ imageId, tagId })
}

export const batchCreateTags = (tags: InternalTag[]) => {
    const insertTags = db.transaction((tags: InternalTag[]) => {
        const statement = db.prepare(`
            INSERT INTO tags (id, franchise, category)
            VALUES (@id, @franchise, @category)
            ON CONFLICT(id, franchise, category) DO NOTHING;
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

export const batchLinkImageToTags = (image: InternalImage) => {
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

export const updateImageTags = (image: InternalImage) => {
    const transaction = db.transaction(() => {
        batchCreateTags(image.tags)
        batchLinkImageToTags(image)
    })
    transaction()
}
