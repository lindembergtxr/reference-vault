function getGridColumns(container: HTMLElement): number {
    const styles = window.getComputedStyle(container)
    return styles.gridTemplateColumns.split(' ').length
}

export function captureGridState(container: HTMLElement, itemIndex: number, page: number) {
    const columns = getGridColumns(container)

    const rowIndex = Math.floor(itemIndex / columns)
    const rowTop = container.scrollTop

    return { page, itemIndex, columns, rowIndex, scrollTop: rowTop }
}

type GridState = {
    itemIndex: number
    columns: number
}
export function restoreGridScroll(container: HTMLElement, state: GridState) {
    const rowIndex = Math.floor(state.itemIndex / state.columns)

    const rowHeight = container.querySelector('[data-id]')?.clientHeight || 0

    container.scrollTo({ top: rowHeight * rowIndex, behavior: 'auto' })
}
