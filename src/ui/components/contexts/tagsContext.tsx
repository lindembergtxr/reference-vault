import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Context } from './tagsCore'

export const TagsContext = ({ children }: PropsWithChildren) => {
    const hasLoaded = useRef(false)

    const [tags, setTags] = useState<InternalTag[]>([])

    const refreshData = () => {
        window.api.getAllTags().then((res) => setTags(res))
    }

    useEffect(() => {
        if (hasLoaded.current === false) {
            refreshData()
            hasLoaded.current = true
        }
    }, [])

    return <Context value={{ tags, setTags, refreshTags: refreshData }}>{children}</Context>
}
