import { MdInfoOutline } from 'react-icons/md'
import { Button, OverlayArrow, Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components'

type TooltipProps = {
    text: string
}
export const TooltipInfo = ({ text }: TooltipProps) => {
    return (
        <TooltipTrigger delay={500}>
            <Button>
                <MdInfoOutline size={12} />
            </Button>
            <AriaTooltip offset={8} className="bg-black text-gray-50 rounded px-2 py-1">
                <OverlayArrow>
                    <svg width={8} height={8} viewBox="0 0 8 8">
                        <path d="M0 0 L4 4 L8 0" />
                    </svg>
                </OverlayArrow>
                <span className="label">{text}</span>
            </AriaTooltip>
        </TooltipTrigger>
    )
}
