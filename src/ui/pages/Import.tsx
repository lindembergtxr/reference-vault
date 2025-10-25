export const Import = () => {
    const importData = () => {
        window.api.importFiles()
    }
    const commitData = () => {
        //
    }
    return (
        <div>
            <div className="flex justify-between align-center w-full py-4 px-4">
                <button
                    className="bg-gray-500 text-gray-100 rounded-full px-4 py-1"
                    onClick={importData}
                >
                    Import
                </button>

                <button
                    className="bg-green-500 text-gray-100 rounded-full px-4 py-1 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed"
                    disabled
                    onClick={commitData}
                >
                    Commit
                </button>
            </div>
            <h1>Import</h1>
        </div>
    )
}
