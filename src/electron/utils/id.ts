import { customAlphabet } from 'nanoid'

export const generateId = () => {
    const alphabet =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    const nanoid = customAlphabet(alphabet, 12)

    return nanoid(12)
}
