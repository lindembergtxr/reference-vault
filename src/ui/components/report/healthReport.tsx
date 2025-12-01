import { useState } from 'react'
import { Button } from 'react-aria-components'

import { cn } from '../../utils'

export function HealthReport() {
    const [report, setReport] = useState<HealthReport | null>(null)

    function generateReport() {
        window.api.generateHealthReport().then((res) => {
            if (res.success && res.data) setReport(res.data)
            else alert(`Failed to generate report - ${JSON.stringify(res.error)}`)
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="label font-semibold dark:text-tetsu-300">Health Report</p>

                <Button
                    className={cn(
                        'flex justify-center items-center w-fit px-6 py-2 rounded caption text-xs font-medium',
                        'bg-tetsu-800 text-tetsu-100',
                        'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                        'disabled:bg-gray-200 disabled:text-gray-500'
                    )}
                    onClick={generateReport}
                >
                    Generate Report
                </Button>
            </div>

            {report && (
                <div className="flex flex-col gap-4 w-full h-1/2 border rounded border-tetsu-400 overflow-hidden">
                    <div className="flex flex-col gap-4 w-full min-h-0 px-3 py-5 overflow-scroll">
                        <div className="flex flex-col gap-2">
                            <p className="label font-semibold dark:text-tetsu-300">
                                Total of images
                            </p>

                            <p className="font-mono text-sm font-medium text-tetsu-600">
                                {report.totalImages} {report.totalImages === 1 ? 'image' : 'images'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="label font-semibold dark:text-tetsu-300">Database</p>

                            <p>{report.database.length > 0 && JSON.stringify(report.database)}</p>

                            {report.database.length === 0 && (
                                <p className="font-mono text-sm text-tetsu-300">
                                    No invalid database image entries.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="label font-semibold dark:text-tetsu-300">Images Folder</p>

                            <p>
                                {report.imagesFolder.length > 0 &&
                                    JSON.stringify(report.imagesFolder)}
                            </p>

                            {report.imagesFolder.length === 0 && (
                                <p className="font-mono text-sm text-tetsu-300">
                                    No floating image files.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="label font-semibold dark:text-tetsu-300">
                                Thumbnails Folder
                            </p>

                            <p>
                                {report.thumbnailFolder.length > 0 &&
                                    JSON.stringify(report.thumbnailFolder)}
                            </p>

                            {report.thumbnailFolder.length === 0 && (
                                <p className="font-mono text-sm text-tetsu-300">
                                    No floating thumbnail image files.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
