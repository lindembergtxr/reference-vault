export const ImagePreview = ({ url, closePreview }: { url: string; closePreview: () => void }) => {
    console.log('preview', url)
    return (
        <div>
            <img src={`file://${url}`} alt={url} />
            <button onClick={closePreview}>x</button>
        </div>
    )
}
