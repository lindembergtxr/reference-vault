import { Outlet } from 'react-router-dom'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

import { cn } from '../../utils/classname'
import { useConfig } from '../../utils/configProvider'
import { LayoutNavigation } from './LayoutNavigation'
import { LayoutTitle } from './LayoutTitle'

const surfaceCell = 'bg-surface border-[1px] border-tetsu-500/30'
const elevatedCell = 'bg-elevated border-[1px] border-tetsu-500/30'

export const Layout = () => {
    const { config, toggleTheme } = useConfig()

    const theme = config?.theme ?? null

    return (
        <div className="min-h-screen h-screen grid grid-cols-[max(15rem,_20vw)_1fr] grid-rows-[3rem_minmax(0,_1fr)_3rem] bg-black relative overflow-hidden">
            <div className={cn('col-start-1 col-span-1 row-start-1 row-span-1', elevatedCell)}>
                <LayoutTitle />
            </div>

            <aside className={cn('col-span-1 col-start-1 row-span-1 row-start-2', elevatedCell)}>
                <LayoutNavigation />
            </aside>

            <main
                className={cn(
                    'col-span-1 col-start-2 row-span-1 row-start-2 overflow-scroll',
                    surfaceCell
                )}
            >
                <Outlet />
            </main>

            <div className={cn('col-span-1 col-start-1 row-span-1 row-start-3 p-4', elevatedCell)}>
                <button className="w-full h-full flex items-center" onClick={toggleTheme}>
                    <div className="label gap-4 flex text-tetsu-900 dark:text-tetsu-300">
                        {theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}
                        <p>{theme === 'dark' ? 'Dark' : 'Light'}</p>
                    </div>
                </button>
            </div>

            <div className={cn('col-span-1 row-span-1 col-start-2 row-start-1', elevatedCell)} />

            <div className={cn('col-span-1 row-span-1 col-start-2 row-start-3', elevatedCell)} />
        </div>
    )
}
