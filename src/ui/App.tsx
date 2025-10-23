import { useEffect, useState } from 'react'

import './App.css'

function App() {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        window.api.getAllTags().then((res) => setTags(res))
    }, [])

    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                <p>{JSON.stringify(tags)}</p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
