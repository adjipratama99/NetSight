"use client"

import Bandwith from "@/components/pages/dashboard/Bandwith";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DEVICES_LIST } from "@/contexts/actions";
import { findCenter, subtractDate } from "@/lib/Helper";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaMapMarker } from "react-icons/fa";
import { useSidebar } from "@/contexts/useSidebar";
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en'
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useMap, Marker, NavigationControl } from "react-map-gl";
import { Map } from "@/components/customs/maps";
import { chartColor, maxAnalytics } from "@/lib/Constants";
let intervalRefetch = null

export default function DashboardPage() {
    const sidebar = useSidebar()
    const { MapDevice } = useMap()
    const [devices, setDevices] = useState([])
    const [dates, setDate] = useState({ 
        startDate: subtractDate(new Date(), 'days', 7),
        endDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    })
    const [device, setDevice] = useState(null)

    const { data, isLoading, refetch } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    })

    const deviceClick = async (deviceData) => {
        const existing = devices.find(data => data.id === deviceData._id)
        setDevice({ deviceId: deviceData._id, deviceName: deviceData.name })

        if(devices.length === maxAnalytics) {
            toast.warn('Maximum monitor device opened is '+ maxAnalytics +'. Close one of the monitor to see other device.')
            return
        }

        if(!existing) getBandwith({ deviceId: deviceData._id, ...dates }, deviceData.name)
    }

    const getBandwith = async (params, deviceName) => {
        const req = await fetchPost({
            url: '/api/device?dest=getBandwith',
            body: params
        }, true)

        const existing = devices.find(data => data.id === params.deviceId)

        if(existing) {
            let filter = devices.filter(data => data.id !== params.deviceId)
            filter = [...filter, {id: params.deviceId, name: deviceName, result: req.result}]
            setDevices(filter)
        } else {
            setDevices(prev => [...prev, {id: params.deviceId, name: deviceName, result: req.result}])
        }
    }

    if(data && data?.result.length) {
        const coords = []

        data.result.map(val => coords.push({"lng": val.coordinates.lon, "lat": val.coordinates.lat}))
        const centre = findCenter(coords)

        if(MapDevice) {
            MapDevice.flyTo({
                center: [centre.lng, centre.lat],
                duration: 2000,
                essential: true })
        }
    }

    const refetchRequest = async () => {
        intervalRefetch = setInterval(() => {
            refetch()
        }, 10000)
    }

    useEffect(() => {
        setDevices(prev => prev)
        refetchRequest()

        if(devices && devices.length) {
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
                        getBandwith({ 
                            deviceId: device.deviceId,
                            startDate: formattedDate[0] + ' '+ format(new Date(), 'HH:mm:ss'),
                            endDate: formattedDate[1] + ' '+ format(new Date(), 'HH:mm:ss')
                         }, device.deviceName)
                    }
                }
            })
        }
    }, [sidebar, devices])

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                    <h1 className="text-md">Devices</h1>
                </CardHeader>
                <CardContent className={
                    cn(
                        'h-[400px] px-4'
                    )
                }>
                    {
                        isLoading && typeof data === "undefined" ?
                        <div className="flex items-center gap-1">
                            <CgSpinner className="animate-spin" /> Getting devices ...
                        </div>
                        :
                        null
                    }
                    <div className={
                        cn('relative z-10')
                    }>
                        <Map
                            id="dashboardMap"
                            initialViewState={{
                                longitude: 117.5371166,
                                latitude:  -2.8943844,
                                zoom: 3
                            }}
                            style={{ width: "100%", height: "380px" }}
                            className="rounded-lg"
                        >
                            <NavigationControl />
                            {
                                data?.result.length ?
                                    data.result.map(device => (
                                        <div 
                                        key={device._id}
                                        >
                                            <Marker
                                                latitude={parseFloat(device?.coordinates.lat)}
                                                longitude={parseFloat(device?.coordinates.lon)}
                                                onClick={() => deviceClick(device)}
                                            >
                                                <span 
                                                className="relative flex h-3 w-3 cursor-pointer">
                                                    <FaMapMarker 
                                                        className={
                                                            cn(
                                                                "absolute animate-ping inline-flex h-full w-full rounded-full",
                                                                device.status ? "text-green-500" : 'text-yellow-500'
                                                            )
                                                        }
                                                    />
                                                    <FaMapMarker 
                                                        className={
                                                            cn(
                                                                "relative inline-flex rounded-full",
                                                                device.status ? "text-green-500" : 'text-red-500'
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </Marker>
                                        </div>
                                    ))
                                : null
                            }
                        </Map>
                    </div>
                </CardContent>
            </Card>
            {
                devices.length ?
                    <div className="flex gap-4 flex-col">
                        <div className="grid grid-cols-6">
                            <div className="col-span-5"></div>
                            <Input type="text" placeholder="Enter date ..." className="dateRange border-red-800 max-w-[250px]"/>
                        </div>
                        {
                            devices.map(device => (
                                <Bandwith 
                                key={device.id} 
                                data={device} 
                                setDevice={setDevices}
                                 />
                            ))
                        }
                    </div>
                : null
            }
        </div>
    )
}