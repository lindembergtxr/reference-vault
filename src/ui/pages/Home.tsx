import { useEffect, useState } from 'react'

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
        </div>
    )
}
