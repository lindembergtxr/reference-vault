window.addEventListener('error', (event) => {
    window.api.logError({ message: event.message, error: event.error?.stack })
})

window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    if (reason instanceof Error) {
        window.api.logError({ message: reason.message, error: reason.stack })
    } else {
        window.api.logError({ message: String(reason) })
    }
})
