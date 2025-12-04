import { CATEGORY_SHORTCUTS } from './tags.utils'

export const TagsCSVInputShortcuts = () => {
    return (
        <div className="text-sm text-tetsu-200 dark:text-tetsu-800">
            <div className="flex items-center gap-2 flex-wrap mt-1">
                {Object.entries(CATEGORY_SHORTCUTS).map(([k, v]) => (
                    <div
                        key={k}
                        className="flex gap-1 px-2 py-1 bg-tetsu-800 rounded text-xs dark:bg-tetsu-300"
                    >
                        <span>⌘{k} =</span>
                        <span>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
