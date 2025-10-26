import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('electron', () => ({
    app: {
        getAppPath: vi.fn(() => '/tmp/test'),
        getPath: vi.fn(() => '/fake/userData'),
    },
    ipcMain: {
        handle: vi.fn(),
        on: vi.fn(),
    },
    dialog: vi.fn(),
    WebContents: vi.fn(),
    WebFrameMain: vi.fn(),
}))

vi.mock('./src/electron/helpers/helpers.js', () => ({
    getAppPathHelper: vi.fn(() => '/tmp/test'),
    getUserDataPath: vi.fn(() => '/userData/path'),
}))
