import { TabList as BaseList } from 'react-aria-components'
import { cn } from '../utils'

type TabListProps = {
    id: string
    children: React.ReactNode
}
export function TabList({ id, children }: TabListProps) {
    return (
        <BaseList
            className={cn(
                'flex items-center w-full bg-tetsu-200 border-b border-tetsu-300',
                'bg-tetsu-200 dark:bg-tetsu-800 dark:text-tetsu-200 dark:border-tetsu-600'
            )}
            aria-label={id}
        >
            {children}
        </BaseList>
    )
}
