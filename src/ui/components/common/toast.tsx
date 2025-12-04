import { ReactNode } from 'react'
import toast, { toast as baseToast, ToastOptions } from 'react-hot-toast'
import { MdCheckCircle, MdError, MdInfo, MdOutlineClose } from 'react-icons/md'

const toastClass = {
    info: 'border border-blue-500 bg-blue-100',
    success: 'border border-green-500 bg-green-100',
    error: 'border border-red-500 bg-red-100',
}
const InfoIcon = {
    info: <MdInfo className="h-7 w-7 text-blue-500" />,
    success: <MdCheckCircle className="h-7 w-7 text-green-500" />,
    error: <MdError className="h-7 w-7 text-red-500" />,
}

type ToastArgs = {
    type: keyof typeof InfoIcon
    id?: string
    title: string
    message?: ReactNode
}

function myToast({ type, id, title, message }: ToastArgs) {
    const options: ToastOptions = {
        id,
        position: 'bottom-center',
        className: toastClass[type],
    }

    baseToast(
        <div className="flex items-center gap-3">
            {InfoIcon[type]}

            <div className="flex flex-col justify-center">
                <p className="font-bold text-base">{title}</p>
                {message && <p className="text-gray-500 text-xs max-w-[60vw]">{message}</p>}
            </div>

            <button
                className="rounded-full p-1 hover:bg-black/20"
                onClick={() => toast.dismiss(id)}
            >
                <MdOutlineClose className="h-5 w-5" />
            </button>
        </div>,
        options
    )
}

export function toastError(args: Omit<ToastArgs, 'type'>) {
    myToast({ ...args, type: 'error' })
}

export function toastSuccess(args: Omit<ToastArgs, 'type'>) {
    myToast({ ...args, type: 'success' })
}

export function toastInfo(args: Omit<ToastArgs, 'type'>) {
    myToast({ ...args, type: 'info' })
}
