import { CSVTag } from './tags.type'

type TagsCSVTableProps = {
    tags: CSVTag[]
}
export const TagsCSVTable = ({ tags }: TagsCSVTableProps) => {
    return (
        <div className="w-full overflow-auto flex flex-col gap-4">
            <table className="table-fixed w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-tetsu-100 dark:bg-tetsu-800 border-b border-gray-600">
                    <tr className="text-left">
                        <th className="w-12 h-9 truncate px-2 font-medium dark:text-tetsu-300">
                            #
                        </th>
                        <th className="w-32 h-9 truncate px-2 font-medium dark:text-tetsu-300">
                            Name
                        </th>
                        <th className="w-32 h-9 truncate px-2 font-medium dark:text-tetsu-300">
                            Category
                        </th>
                        <th className="w-32 h-9 truncate px-2 font-medium dark:text-tetsu-300">
                            Franchise
                        </th>
                    </tr>
                </thead>
                <tbody className="overflow-scroll">
                    {tags.map((tag) => (
                        <tr
                            key={tag.line}
                            className={tag.error ? 'bg-red-900/30' : 'bg-green-900/20'}
                        >
                            <td className="truncate px-2">{tag.line - 1}</td>
                            <td className="truncate px-2">{tag.name}</td>
                            <td className="truncate px-2">{tag.category}</td>
                            <td className="truncate px-2">{tag.franchise}</td>
                        </tr>
                    ))}
                    {tags.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-4 dark:text-tetsu-300">
                                No tags to show. Write tags on the editor.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
