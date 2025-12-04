type ConfigDataTheme = 'dark' | 'light'

type Workspace = {
    name: string
    outputDir: string | undefined
}

type ConfigData = {
    theme: ConfigDataTheme
    currentWorkspace: Workspace['name'] | undefined
    workspaces: Workspace[]
}
