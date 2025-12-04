import { SelectionIndicator, Tab, TabList, TabPanel, Tabs } from 'react-aria-components'

import { TagsCreator } from '../features/tags/tagsCreator'
import { cn } from '../utils'
import { TagsRemover } from '../features/tags/tagsRemover'
import { TagsEditor } from '../features/tags/tagsEditor'

export const TagsPage = () => {
    return (
        <Tabs defaultSelectedKey="tag-tab-create" className="flex flex-col w-full h-full gap-3">
            <TabList
                className={cn(
                    'flex items-center w-full bg-tetsu-200 border-b border-tetsu-300',
                    'bg-tetsu-200 dark:bg-tetsu-800 dark:text-tetsu-200 dark:border-tetsu-600'
                )}
                aria-label="Tags-tabs"
            >
                <Tab
                    id="tag-tab-create"
                    className={cn(
                        'px-4 py-2 cursor-pointer label text-sm hover:bg-tetsu-200',
                        'data-[selected]:border-b-2 data-[selected]:border-tetsu-500 dark:data-[selected]:border-tetsu-200',
                        'dark:hover:bg-tetsu-600 dark:hover:text-tetsu-200'
                    )}
                >
                    <span>Create</span>
                    <SelectionIndicator />
                </Tab>
                <Tab
                    id="tag-tab-remove"
                    className={cn(
                        'px-4 py-2 cursor-pointer label text-sm hover:bg-tetsu-200',
                        'data-[selected]:border-b-2 data-[selected]:border-tetsu-500 dark:data-[selected]:border-tetsu-200',
                        'dark:hover:bg-tetsu-600 dark:hover:text-tetsu-200'
                    )}
                >
                    <span>Remove</span>
                    <SelectionIndicator />
                </Tab>

                <Tab
                    id="tag-tab-edit"
                    className={cn(
                        'px-4 py-2 cursor-pointer label text-sm hover:bg-tetsu-200',
                        'data-[selected]:border-b-2 data-[selected]:border-tetsu-500 dark:data-[selected]:border-tetsu-200',
                        'dark:hover:bg-tetsu-600 dark:hover:text-tetsu-200'
                    )}
                >
                    <span>Edit</span>
                    <SelectionIndicator />
                </Tab>
            </TabList>

            <TabPanel id="tag-tab-create" className="flex w-full flex-1 px-4 py-2 pb-5">
                <TagsCreator />
            </TabPanel>

            <TabPanel id="tag-tab-remove" className="flex w-full flex-1 px-4 py-2 pb-5">
                <TagsRemover />
            </TabPanel>

            <TabPanel id="tag-tab-edit" className="flex w-full flex-1 px-4 py-2 pb-5">
                <TagsEditor />
            </TabPanel>
        </Tabs>
    )
}
