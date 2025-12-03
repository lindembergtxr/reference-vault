import { SelectionIndicator, Tab, TabList, TabPanel, Tabs } from 'react-aria-components'
import { cn } from '../utils'
import { GallerySearch } from '../components/gallery/gallerySearch'
import { GalleryDuplicates } from '../components/gallery/galleryDuplicates'

export const Gallery = () => {
    return (
        <Tabs defaultSelectedKey="gallery-tab-search" className="flex flex-col w-full h-full gap-3">
            <TabList
                className={cn(
                    'flex items-center w-full bg-tetsu-200 border-b border-tetsu-300',
                    'bg-tetsu-200 dark:bg-tetsu-800 dark:text-tetsu-200 dark:border-tetsu-600'
                )}
                aria-label="Tags-tabs"
            >
                <Tab
                    id="gallery-tab-search"
                    className={cn(
                        'px-4 py-2 cursor-pointer label text-sm hover:bg-tetsu-200',
                        'data-[selected]:border-b-2 data-[selected]:border-tetsu-500 dark:data-[selected]:border-tetsu-200',
                        'dark:hover:bg-tetsu-600 dark:hover:text-tetsu-200'
                    )}
                >
                    <span>Search</span>
                    <SelectionIndicator />
                </Tab>
                <Tab
                    id="gallery-tab-duplicates"
                    className={cn(
                        'px-4 py-2 cursor-pointer label text-sm hover:bg-tetsu-200',
                        'data-[selected]:border-b-2 data-[selected]:border-tetsu-500 dark:data-[selected]:border-tetsu-200',
                        'dark:hover:bg-tetsu-600 dark:hover:text-tetsu-200'
                    )}
                >
                    <span>Duplicates</span>
                    <SelectionIndicator />
                </Tab>
            </TabList>

            <TabPanel id="gallery-tab-search" className="flex w-full flex-1 overflow-hidden">
                <GallerySearch />
            </TabPanel>

            <TabPanel id="gallery-tab-duplicates" className="flex w-full flex-1 overflow-hidden">
                <GalleryDuplicates />
            </TabPanel>
        </Tabs>
    )
}
