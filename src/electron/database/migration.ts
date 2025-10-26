import fs from 'fs'
import path from 'path'

import * as helpers from '../helpers/index.js'
import * as utils from '../utils/index.js'
import { db } from './index.js'

const relativeDir = '/src/electron/database/migrations'

const migrationsDir = path.join(helpers.getAppPathHelper(), relativeDir)

export const runSqlMigrations = (): void => {
    const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort()

    console.log(`Found ${files.length} migration(s) to process.`)

    for (const file of files) {
        const migrationName = path.basename(file)

        const exists = db.prepare('SELECT 1 FROM migrations WHERE name = ?').get(migrationName)

        if (exists) {
            console.log(`Skipping already run migration: ${migrationName}`)
            continue
        }

        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')

        try {
            db.exec(sql)

            const prepareSQL = 'INSERT INTO migrations(name) VALUES(?)'

            db.prepare(prepareSQL).run(migrationName)

            console.log(`Migration executed: ${migrationName}`)
        } catch (err) {
            const message = utils.errorMessages['MigrationError'](migrationName)
            utils.logError({ message, error: err })
            throw utils.generateError('MigrationError', migrationName)
        }
    }
}
