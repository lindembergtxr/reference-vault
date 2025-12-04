import { ComponentProps } from 'react'
import { Tabs } from 'react-aria-components'

export function TabRoot({ id, children, ...props }: ComponentProps<typeof Tabs>) {
    return (
        <Tabs defaultSelectedKey={id} {...props} className="flex flex-col w-full h-full gap-3">
            {children}
        </Tabs>
    )
}
