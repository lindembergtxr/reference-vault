import { adaptInternalTabToDB } from '../adapters/tags.js'
import { db } from '../database/index.js'

export const getAllTags = () => {
    return db.prepare('SELECT * FROM tags ORDER BY id ASC').all() as InternalTag[]
}

export const createTag = (tag: InternalTag, context = db) => {
    const dbTag = adaptInternalTabToDB(tag)

    const statement = context.prepare(`
        INSERT INTO tags (id, name, franchise)
        VALUES (@id, @name, @franchise)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            franchise = excluded.franchise
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
        const created: string[] = []

        const statement = db.prepare(`
            INSERT INTO tags (id, name, franchise)
            VALUES (@id, @name, @franchise)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                franchise = excluded.franchise
        `)
        for (const tag of tags) {
            const dbTag = adaptInternalTabToDB(tag)
            const result = statement.run(dbTag)

            if (result.changes > 0) created.push(dbTag.name)
        }
        return created
    })
    return insertTags(tags)
}
