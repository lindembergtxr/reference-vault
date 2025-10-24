import { useEffect, useState } from 'react'
import { ImageList } from '../components/images/ImageList'

const Home = () => {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        window.api.getAllTags().then((res) => setTags(res))
    }, [])

    return (
        <div>
            <h1>React</h1>
            <div className="card">
                <p>{JSON.stringify(tags)}</p>
            </div>
            <ImageList images={[]} />
        </div>
    )
}

export default Home
