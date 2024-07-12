"use client"

import { DEVICES_LIST } from "@/contexts/actions";
import { randNumber, subtractDate } from "@/lib/Helper";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaFileAlt, FaServer, FaTimes } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import Bandwith from "@/components/pages/dashboard/Bandwith";
import { maxAnalytics } from "@/lib/Constants";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { DateRangePicker } from "rsuite";
import ComboBox from "@/components/customs/forms/combobox";
const { allowedRange } = DateRangePicker

export default function ReportPage() {
    const { data: session } = useSession()
    const { toPDF, targetRef } = usePDF({ filename: "Report-Monitoring-Device-"+ format(new Date(), 'yyyy-MM-dd') +'.pdf' })
    const [deviceIds, setDeviceIds] = useState([])
    const [comboOpen, setComboOpen] = useState(true)
    const [dates, setDate] = useState({ 
        startDate: subtractDate(new Date(), 'days', 7),
        endDate: subtractDate(new Date(), 'days', 1)
    })
    const { data, isLoading } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    })

    const addDeviceId = (deviceId) => {
        const res = data?.result.filter(val => val._id === deviceId)
        const filter = deviceIds.filter(data => data._id === deviceId)

        if(!filter.length) {
            if(deviceIds.length > maxAnalytics) {
                toast.warning('Maximal analytic opened is '+ maxAnalytics +'. Please close one of the analytic to add another.')
                r
                eturn
            }

            setDeviceIds(prev => [...prev, { _id: deviceId, deviceName: res[0].name }])
        }
    }

    return (
        <div className={
            cn("flex flex-col gap-4")
        }>
            {
                parseInt(process.env.NEXT_PUBLIC_APP_MAINTENANCE) ?
                <h1 className="text-red-700 text-2xl text-center">[UNDER MAINTENANCE]</h1>
                :
                <div>
                    <div className="flex justify-end gap-2 items-center">
                        {
                            deviceIds && deviceIds.length ?
                                <>
                                    <Button variant="secondary" onClick={() => toPDF()} className="flex items-center gap-1"><FaFileAlt />Generate PDF</Button>
                                    <DateRangePicker
                                        defaultValue={[parseISO(dates?.startDate), parseISO(dates?.endDate)]}
                                        block
                                        disabledDate={allowedRange(subtractDate(new Date(), 'years', 1), format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
                                        onOk={(value) => {
                                            setDate({ startDate: format(value[0], 'yyyy-MM-dd HH:mm:ss'), endDate: format(value[1], 'yyyy-MM-dd HH:mm:ss') })
                                        }}
                                        className="w-[250px]"
                                    />
                                </>
                            : null
                        }
                    </div>
                    <div className={
                        cn(
                            "flex gap-6"
                        )
                    }>
                        <div className={cn(
                            "w-[250px] p-4 bg-neutral-50 rounded-lg"
                        )}>
                            <h1 className="text-sm border-b-2 mb-4 pb-3">Device List</h1>
                            {
                                isLoading && typeof data === "undefined" ?
                                    <div className="flex items-center gap-1">
                                        <CgSpinner className="animate-spin" />Getting devices ...
                                    </div>
                                :
                                !isLoading && data?.result?.length ?
                                    <div className="h-[50vh] overflow-y-scroll">
                                        <ComboBox
                                            fullWidth
                                            onSelect={(val) => addDeviceId(val.split('-')[0])}
                                            placeholder="Select device"
                                            open={comboOpen}
                                            onOpenChange={setComboOpen}
                                            opts={
                                                data.result.map(device => { return { "value": device._id +'-'+ device.name, "label": device.name } })
                                            }
                                        />
                                    </div>
                                :
                                <div className="flex items-center gap-2 text-muted"><FaTimes />{ data?.message || "Data not Available." }</div>
                            }
                        </div>
                        {
                            deviceIds && deviceIds.length ?
                                <div ref={targetRef} className="w-full flex flex-col gap-4 p-4" id="wrapReport">
                                    <div className="flex items-center justify-center flex-col gap-1">
                                        <h1 className="text-xl font-semibold">{ process.env.NEXT_PUBLIC_APP_NAME } Reports</h1>
                                        <div className="text-md">Created at { format(new Date(), 'dd MMM yyyy HH:mm:ss') } by { session?.token?.username }</div>
                                    </div>
                                    {
                                        deviceIds.map((device, ind) => {
                                            const rand = randNumber(10000)
                                            return (
                                                <Bandwith
                                                    dates={dates}
                                                    currentData={device}
                                                    isReport={true}
                                                    setDeviceIds={setDeviceIds}
                                                    deviceIds={deviceIds}
                                                    key={rand}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            : null
                        }
                    </div>
                </div>
            }
        </div>
    )
}