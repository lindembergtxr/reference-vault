type ConfigDataTheme = 'dark' | 'light'

type ConfigData = {
    theme: ConfigDataTheme
    outputDir: string | null
    thumbnailOutputDir: string | null
    lastOpenedFolder: string | null
}
