import { useEffect, useState } from 'react'
import Sidebar from '../features/sidebar'

const Home = () => {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        window.api.getAllTags().then((res) => setTags(res))
    }, [])

    return (
        <div>
            <Sidebar />
            <h1>React</h1>
            <div className="card">
                <p>{JSON.stringify(tags)}</p>
            </div>
        </div>
    )
}

export default Home
