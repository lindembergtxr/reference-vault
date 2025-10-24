# Reference Vault

![React](https://img.shields.io/badge/react-19.x-blue)
![Node.js](https://img.shields.io/badge/node-24.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![In Progress](https://img.shields.io/badge/status-in%20progress-yellow)

Reference Vault is a local, offline-first media manager for images, books, and other references. It allows you to organize, tag, and quickly browse your collection with thumbnails, search, and metadata.

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Electron, Node.js
- **Database:** SQLite (via better-sqlite3)
- **Build Tools:** Vite, TypeScript
- **Other:** React Icons, Headless UI

## Features

- Import and organize media into a structured local database
- Add, view, and filter tags for items
- Generate thumbnails for faster browsing
- Offline-first: no internet required
- Supports custom metadata for future-proof organization

## Getting Started

### Prerequisites

- Node.js ≥ 24.x
- NPM ≥ 9.x
- macOS, Windows, or Linux
- (macOS) Xcode Command Line Tools if building Electron binaries

### Installation

#### Clone the repository:

```bash
git clone https://github.com/lindembergtxr/reference-vault.git
cd reference-vault
```

#### Install dependencies

```bash
npm install
```

#### Create a .env file in the project root (example values)

```
VITE_DEVELOPMENT_PORT=3000
VITE_DATABASE_FILENAME=database.db
```

#### Run in development

```bash
npm run dev
```

#### Building the App

##### For macOS

```bash
npm run dist:mac
```

##### For Linux

```bash
npm run dist:linux
```

##### For Windows

```bash
npm run dist:win
```

### Project structure

```
/src/electron               - Backend and preload scripts
/src/ui                     - React frontend
/src/electron/databases     - SQLite schema & migrations
.env                        - Environment variables
```

### Notes

- Database is auto-created on first run.
- Images are not stored in the database, only paths and metadata.
- Dev mode requires webSecurity: false for local image loading.
- Migrations are stored as .sql files and executed automatically.

## License

MIT
