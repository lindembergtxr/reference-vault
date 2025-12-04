import {
    MdClose,
    MdOutlineCenterFocusWeak,
    MdOutlineZoomIn,
    MdOutlineZoomOut,
} from 'react-icons/md'
import { cn } from '../../utils/classname'

type ImagePreviewControllerProps = {
    zoomIn: () => void
    zoomOut: () => void
    resetTransform: () => void
    centerView: () => void
    onClose: () => void
}
export const ImagePreviewController = ({
    zoomIn,
    zoomOut,
    resetTransform,
    centerView,
    onClose,
}: ImagePreviewControllerProps) => {
    return (
        <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between pointer-events-none">
            <div className="flex gap-2 bg-tetsu-50 backdrop-blur rounded shadow-lg pointer-events-auto">
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
                        'bg-tetsu-50 backdrop-blur px-3 h-10 shadow hover:bg-gray-300 pointer-events-auto',
                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                    )}
                    onClick={onClose}
                >
                    <MdClose size={24} />
                </button>
            </div>
        </div>
    )
}
