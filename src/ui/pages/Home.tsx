import { useEffect, useState } from 'react'
import { ImageList } from '../components/images/ImageList'

export const Home = () => {
    const [tags, setTags] = useState<InternalTag[]>([])

    useEffect(() => {
        window.api.getAllTags().then((res) => setTags(res))
    }, [])

    return (
        <div>
            <h1>Home</h1>
            <div className="card">
                <p>{JSON.stringify(tags)}</p>
            </div>
            <ImageList images={[]} />
        </div>
    )
}
