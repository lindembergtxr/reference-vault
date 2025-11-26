import {
    MdClose,
    MdOutlineCenterFocusWeak,
    MdOutlineZoomIn,
    MdOutlineZoomOut,
} from 'react-icons/md'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { cn } from '../../utils/classname'

type ImagePreviewProps = {
    image: InternalImage
    closePreview: () => void
}
export const ImagePreview = ({ image, closePreview }: ImagePreviewProps) => {
    if (!image?.imagePath) return null

    return (
        <TransformWrapper initialScale={1} centerOnInit centerZoomedOut>
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
                <div className="flex flex-1 items-center justify-center w-full relative h-full min-h-0 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-2 left-2 right-2 z-10 flex justify-between pointer-events-none">
                            <div className="flex gap-2 bg-white backdrop-blur rounded shadow-lg pointer-events-auto">
                                <div className="flex items-center gap-2">
                                    <button
                                        className={cn(
                                            'px-3 h-10 hover:bg-gray-300',
                                            'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                        )}
                                        onClick={() => zoomIn()}
                                    >
                                        <MdOutlineZoomIn className="h-5 w-5" />
                                    </button>
                                    <button
                                        className={cn(
                                            'px-3 h-10 hover:bg-gray-300',
                                            'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                        )}
                                        onClick={() => zoomOut()}
                                    >
                                        <MdOutlineZoomOut className="h-5 w-5" />
                                    </button>
                                    <button
                                        className={cn(
                                            'px-3 h-10 hover:bg-gray-300',
                                            'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                        )}
                                        onClick={() => centerView()}
                                    >
                                        <MdOutlineCenterFocusWeak className="h-5 w-5" />
                                    </button>
                                    <button
                                        className={cn(
                                            'px-3 h-10 hover:bg-gray-300',
                                            'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                        )}
                                        onClick={() => resetTransform()}
                                    >
                                        <p className="label">Reset</p>
                                    </button>
                                </div>

                                <button
                                    className={cn(
                                        'bg-white/80 backdrop-blur px-3 h-10 shadow hover:bg-gray-300 pointer-events-auto',
                                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                    )}
                                    onClick={closePreview}
                                >
                                    <MdClose size={24} />
                                </button>
                            </div>
                        </div>

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
