import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ImagePreviewController } from './imagePreviewController'

type ImagePreviewProps = {
    image: InternalImage
    closePreview: () => void
}
export const ImagePreview = ({ image, closePreview }: ImagePreviewProps) => {
    if (!image?.imagePath) return null

    return (
        <TransformWrapper initialScale={1} centerOnInit centerZoomedOut>
            {(transformProps) => (
                <div className="flex flex-1 items-center justify-center w-full relative h-full min-h-0 overflow-hidden">
                    <div className="absolute inset-0">
                        <ImagePreviewController {...transformProps} onClose={closePreview} />

                        <TransformComponent
                            wrapperStyle={{ width: '100%', height: '100%' }}
                            contentStyle={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src={`file://${encodeURI(image.imagePath ?? '')}`}
                                className="max-w-full max-h-full object-contain select-none"
                                draggable={false}
                            />
                        </TransformComponent>
                    </div>
                </div>
            )}
        </TransformWrapper>
    )
}
