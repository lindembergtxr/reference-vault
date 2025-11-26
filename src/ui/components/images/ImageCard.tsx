import clsx from 'clsx'
import { MouseEvent } from 'react'
import { MdCheckCircle } from 'react-icons/md'

export type ImageListSize = 'sm' | 'md' | 'lg' | 'xl'

export type ImageCardProps = {
    url: string
    imageId: string
    size?: ImageListSize
    mode?: 'select' | 'open' | 'disabled'
    isSelected: boolean
    onSelect?: (url: string) => void
    onOpen?: (url: string) => void
}
export const ImageCard = (props: ImageCardProps) => {
    const { url, imageId, mode = 'disabled', isSelected, onOpen, onSelect } = props

    const onClick = (evt: MouseEvent<HTMLButtonElement>) => {
        if (mode === 'disabled') {
            evt.preventDefault()
            return
        }
        if (mode === 'select') onSelect?.(imageId)
        else onOpen?.(imageId)
    }

    return (
        <div className="w-full">
            <button
                data-testid="image-link"
                className={clsx(`relative block w-full overflow-hidden shadow-md`, {
                    // cursor
                    'cursor-default': mode === 'disabled',
                    'cursor-pointer': mode !== 'disabled',
                    // hover
                    'hover:scale-[101%] hover:outline-2 hover:ring-4 hover:ring-blue-500/75':
                        mode === 'open' || (mode === 'select' && !isSelected),
                    'ring-4 ring-blue-500/75': isSelected,
                })}
                onClick={onClick}
            >
                <img src={`file://${url}`} alt={url} className="block w-full h-auto" />

                {isSelected && (
                    <div className="absolute bottom-0 right-0">
                        <MdCheckCircle
                            data-testid={`image-card-selected-icon-${url}`}
                            className="text-blue-700 w-6 h-6 filter drop-shadow-[0_0_4px_white]"
                        />
                    </div>
                )}
            </button>
        </div>
    )
}
