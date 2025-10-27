import { db } from '../database/index.js'

export const getAllTags = () => {
    return db.prepare('SELECT * FROM tags').all() as InternalTag[]
}
