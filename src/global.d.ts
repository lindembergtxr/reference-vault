type ApiEventMapping = {
    ping: undefined
}

interface Window {
    api: {
        ping: () => string
    }
}
