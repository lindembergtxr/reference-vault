import clsx from 'clsx'
import { MdCheckCircle } from 'react-icons/md'

type SizeValues = 'sm' | 'md' | 'lg'

const cardSizeMap: Record<SizeValues, string> = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
}

const thumbnailSizeMap: Record<SizeValues, string> = {
    sm: 'max-w-8 max-h-8',
    md: 'max-w-16 max-h-16',
    lg: 'max-w-32 max-h-32',
}

type ImageCardType = {
    url: string
    size: SizeValues
    mode?: 'select' | 'open' | 'disabled'
    isSelected: boolean
    onSelect?: (url: string) => void
    onOpen?: (url: string) => void
}
export const ImageCard = (props: ImageCardType) => {
    const { url, size, mode = 'disabled', isSelected, onOpen, onSelect } = props

    const onClick = () => {
        if (mode === 'disabled') return

        if (mode === 'select') onSelect?.(url)
        else onOpen?.(url)
    }

    return (
        <div
            className={`flex items-center justify-center ${cardSizeMap[size]}`}
        >
            <a
                href="#"
                className={clsx(
                    `relative inline-block rounded-md overflow-hidden shadow-md`,
                    {
                        // cursor
                        'cursor-default': mode === 'disabled',
                        'cursor-pointer': mode !== 'disabled',
                        // hover
                        'hover:scale-105 hover:outline-2 hover:ring-4 hover:ring-blue-500/75':
                            mode === 'open',
                        'ring-4 ring-blue-500/75': isSelected,
                    },
                )}
                onClick={onClick}
            >
                <img
                    src={`file://${url}`}
                    className={thumbnailSizeMap[size]}
                    alt={url}
                />

                {isSelected && (
                    <div className="absolute bottom-0 right-0">
                        <MdCheckCircle className="text-blue-700 w-6 h-6 filter drop-shadow-[0_0_4px_white]" />
                    </div>
                )}
            </a>
        </div>
    )
}
