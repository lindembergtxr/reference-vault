export const getFulfilled = <T>(results: PromiseSettledResult<T>[]): T[] => {
    return results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => (r as PromiseFulfilledResult<T>).value)
}

export const getRejected = <T>(results: PromiseSettledResult<T>[], stage: string) => {
    return results
        .filter((r) => r.status === 'rejected')
        .map((r) => ({ reason: (r as PromiseRejectedResult).reason, stage }))
}
