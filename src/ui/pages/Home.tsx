import { useEffect, useRef, useState } from 'react'

import { ImageList } from '../components/images/ImageList'

export const Home = () => {
    const hasLoaded = useRef(false)

    const [images, setImages] = useState<InternalImage[]>([])

    const refreshData = () => {
        window.api
            .getImageFiles()
            .then((res) => setImages(res.filter((images) => images?.thumbnail.path)))
    }

    useEffect(() => {
        if (hasLoaded.current === false) {
            refreshData()
            hasLoaded.current = true
        }
    }, [])

    return <ImageList images={images} />
}
