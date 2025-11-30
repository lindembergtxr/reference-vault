import { db } from '../../database/index.js'
import { linkTagsToImage } from '../images/images.services.js'

import { adaptInternalTabToDB } from './tags.adapters.js'
import { type TagDB } from './tags.types.js'

export async function getAllTags() {
    return db.prepare('SELECT * FROM tags ORDER BY id ASC').all() as InternalTag[]
}

export async function createTag(tag: TagDB, context = db) {
    const createQuery = `
        INSERT OR IGNORE INTO tags (id, name, franchise, category)
        VALUES (@id, @name, @franchise, @category);
    `
    context.prepare(createQuery).run(tag)

    const readQuery = `
        SELECT id FROM tags
        WHERE name = @name AND franchise = @franchise AND category = @category
        LIMIT 1;
    `
    const row = context.prepare(readQuery).get(tag)

    if (!row) throw new Error('Failed to insert or retrieve tag')

    return (row as { id: string }).id
}

export async function createTags(tags: InternalTagNew[]): Promise<void> {
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
    })

    insertTags(tags)
}

export async function updateImageTags({ id, tags }: InternalImage) {
    const transaction = db.transaction(() => {
        createTags(tags)
        linkTagsToImage({ imageId: id, tags: tags })
    })
    transaction()
}
