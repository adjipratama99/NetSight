import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { eventColumn } from "./EventColumn"
import { DataTableBasic } from "@/components/customs/datatables"
import { DateRangePicker } from "rsuite"
import { format, parseISO } from "date-fns"
import { useState } from "react"
import { subtractDate } from "@/lib/Helper"
import { useQuery } from "@tanstack/react-query"
import { EVENT_ALERT_LIST } from "@/contexts/actions"
import { CgSpinner } from "react-icons/cg"
import { fetchPost } from "@/lib/fetchPost"
const { allowedRange } = DateRangePicker

export default function PageAlertEvent() {
    const [dates, setDate] = useState({ 
        startDate: format(subtractDate(new Date(), 'days', 7), 'yyyy-MM-dd 00:00:00'),
        endDate: format(new Date(), 'yyyy-MM-dd 23:59:59')
    })

    const { data, isLoading, error } = useQuery({
        queryKey: [EVENT_ALERT_LIST, dates],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getAlertListEvent',
            body: {
                ...dates
            }
        }, true)
    })

    return (
        <Card className="w-full">
            <CardHeader className="py-2 px-4 flex flex-row items-center justify-between mb-4">
                <h1 className="text-md">Logs</h1>
                {
                    data?.result && data?.result.length ?
                        <DateRangePicker
                            defaultValue={[parseISO(dates?.startDate), parseISO(dates?.endDate)]}
                            block
                            disabledDate={allowedRange(subtractDate(new Date(), 'years', 1), format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
                            onOk={(value) => {
                                setDate({ startDate: format(value[0], 'yyyy-MM-dd HH:mm:ss'), endDate: format(value[1], 'yyyy-MM-dd HH:mm:ss') })
                            }}
                            className="w-[250px]"
                        /> : null
                }
            </CardHeader>
            <CardContent className={
                cn(
                    'px-4'
                )
            }>
                {
                    isLoading && typeof data === "undefined" ?
                    <div className="flex items-center gap-2">
                        <CgSpinner className="animate-spin" /> Getting data...
                    </div> :
                    !isLoading && data?.result && data?.result.length ?
                        <DataTableBasic
                            columns={eventColumn}
                            data={data}
                            isLoading={isLoading}
                            scrollBody
                            scrollHeight="280px"
                            error={error}
                            rowEachPage={10}
                        />
                    : null
                }
            </CardContent>
        </Card>
    )
}