import { SelectionIndicator, Tab } from 'react-aria-components'
import { cn } from '../../utils'

type TabItemProps = {
    id: string
    children: React.ReactNode
}
export function TabItem({ id, children }: TabItemProps) {
    return (
        <Tab
            id={id}
            className={cn(
                'px-4 py-2 cursor-pointer label text-sm hover:bg-tetsu-200',
                'data-[selected]:border-b-2 data-[selected]:border-tetsu-500 dark:data-[selected]:border-tetsu-200',
                'dark:hover:bg-tetsu-600 dark:hover:text-tetsu-200'
            )}
        >
            {children}
            <SelectionIndicator />
        </Tab>
    )
}
