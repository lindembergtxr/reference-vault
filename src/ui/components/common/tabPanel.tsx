import { TabPanel as BasePanel } from 'react-aria-components'

type TabPanelProps = {
    id: string
    children: React.ReactNode
}
export function TabPanel({ id, children }: TabPanelProps) {
    return (
        <BasePanel id={id} className="flex w-full flex-1 p-5 overflow-hidden">
            {children}
        </BasePanel>
    )
}
