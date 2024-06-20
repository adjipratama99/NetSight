"use client"

import InputUI from "@/components/customs/forms/input";
import { DEVICES_LIST } from "@/contexts/actions";
import { asyncCounter, randNumber, sleep, subtractDate } from "@/lib/Helper";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaFileAlt, FaServer, FaTimes } from "react-icons/fa";
import localeEn from 'air-datepicker/locale/en'
import AirDatepicker from 'air-datepicker';
import { format } from "date-fns";
import Bandwith from "@/components/pages/dashboard/Bandwith";
import { maxAnalytics } from "@/lib/Constants";
import { toast } from "react-toastify";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";


export default function ReportPage() {
    const { data: session } = useSession()
    const { toPDF, targetRef } = usePDF({ filename: "Report-Monitoring-Device-"+ format(new Date(), 'yyyy-MM-dd') +'.pdf' })
    const [deviceIds, setDeviceIds] = useState([])
    const [devices, setDevices] = useState([])
    const [names, setNames] = useState([])
    const [isFetching, setFetching] = useState(false)
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

    const getBandwith = async () => {
        setDevices([])

        console.log(deviceIds)

        if(deviceIds && deviceIds.length) {
            if(deviceIds.length !== maxAnalytics) {
                setFetching(true)
                for await(const ind of asyncCounter(deviceIds.length)) {
                    const deviceId = deviceIds[ind].id
                    if(!names.includes(deviceIds[ind].deviceName))setNames(prev => [...prev, deviceIds[ind].deviceName])
                    const req = await fetchPost({
                        url: '/api/device?dest=getBandwith',
                        body: { deviceId, ...dates }
                    }, true)

                    setDevices(prev => [...prev, { id: deviceId, deviceName: deviceIds[ind].deviceName, result: req }])
                    setFetching(false)
                }
            } else {
                toast.warn('Maximum analytics opened is '+ maxAnalytics +'. Close one of the analytics to see another.')
            }
        }
    }

    const addDeviceId = (deviceId) => {
        const res = data?.result.filter(val => val._id === deviceId)
        const filter = deviceIds.filter(data => data.id === deviceId)

        if(!filter.length) setDeviceIds(prev => [...prev, { id: deviceId, deviceName: res[0].name }])
    }

    useEffect(() => {
        getBandwith()

        new AirDatepicker(".dateRange", {
            startDate: dates.startDate,
            range: true,
            locale: localeEn,
            selectedDates: [dates.startDate, dates.endDate],
            dateFormat: 'yyyy-MM-dd',
            minDate: format(new Date(), 'yyyy') +'-01-01',
            maxDate: format(new Date(), 'yyyy-MM-dd'),
            multipleDatesSeparator: ' - ',
            onSelect: ({ formattedDate }) => {
                if(formattedDate.length == 2) {
                    setDate({ startDate: formattedDate[0], endDate: formattedDate[1] })
                    sleep(1000)
                    getBandwith()
                }
            }
        })
    }, [deviceIds])

    return (
        <div className={
            cn("flex flex-col gap-4")
        }>
            <div className="flex justify-end gap-2 items-center">
                {
                    devices && devices.length ?
                        <Button variant="secondary" onClick={() => toPDF()} className="flex items-center gap-1"><FaFileAlt />Generate PDF</Button>
                    : null
                }
                <InputUI type="text" className="dateRange w-[250px]" placeholder="Enter date range" />
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
                            <div className="h-[75vh] overflow-y-scroll">
                                {
                                    data?.result.map(device => (
                                        <div className={
                                            cn(
                                                "flex items-center gap-2 cursor-pointer text-sm",
                                                deviceIds.includes(device._id) ? "bg-neutral-100" : "hover:bg-neutral-100"
                                            )} 
                                            onClick={() => addDeviceId(device._id)}
                                            key={device._id}>
                                            <FaServer className={device.status ? "text-green-500" : "text-red-500"} />
                                            { device.name }
                                        </div>
                                    ))
                                }
                            </div>
                        :
                        <div className="flex items-center gap-2 text-muted"><FaTimes />{ data?.message || "Data not Available." }</div>
                    }
                </div>
                {
                    isFetching && !devices.length ?
                    <div className="flex items-center gap-1">
                        <CgSpinner className="animate-spin" />Getting data ...
                    </div>
                    :
                    !isFetching && devices && devices.length ?
                        <div ref={targetRef} className="w-full flex flex-col gap-4 p-4">
                            <div className="flex items-center justify-center flex-col gap-1">
                                <h1 className="text-xl font-semibold">{ process.env.NEXT_PUBLIC_APP_NAME } Reports</h1>
                                <div className="text-md">Created at { format(new Date(), 'dd MMM yyyy HH:mm:ss') } by { session?.token?.username }</div>
                            </div>
                            {
                                devices.map((device, ind) => {
                                    const rand = randNumber(10000)
                                    return (
                                        <Bandwith
                                            devices={devices}
                                            data={deviceIds[ind]}
                                            isReport={true}
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
    )
}