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
import { toast } from "react-toastify";
import { useMap, Marker, NavigationControl, Popup } from "react-map-gl";
import { Map } from "@/components/customs/maps";
import { maxAnalytics } from "@/lib/Constants";
import { Modal } from "@/components/customs/modal";
import { Button } from "@/components/ui/button";
import UpdateDevice from "@/components/forms/UpdateDevice";
let intervalRefetch = null

const MarkerMap = ({ clickFn, val }) => {
    const [showPopup, setShowPopup] = useState(false)

    return (
        <>
        {
            showPopup && (
                <Popup
                    anchor="top"
                    latitude={parseFloat(val?.latitude)}
                    longitude={parseFloat(val?.longitude)}
                >
                    {val?.name}
                </Popup>
            )
        }
            <Marker
                latitude={parseFloat(val?.latitude)}
                longitude={parseFloat(val?.longitude)}
                onClick={() => clickFn(val)}
            >
                    <span 
                        className="relative flex h-3 w-3 cursor-pointer"
                        onMouseEnter={() => setShowPopup(true)}
                        onMouseLeave={() => setShowPopup(false)}
                    >
                        <FaMapMarker 
                            className={
                                cn(
                                    "absolute animate-ping inline-flex h-full w-full rounded-full",
                                    val.status ? "text-green-500" : 'text-yellow-500'
                                )
                            }
                        />
                        <FaMapMarker 
                            className={
                                cn(
                                    "relative inline-flex rounded-full",
                                    val.status !== 1 ? "text-green-500" : 'text-red-500'
                                )
                            }
                        />
                    </span>
            </Marker>
        </>
    )
}

export default function DashboardPage() {
    const sidebar = useSidebar()
    const { MapDevice } = useMap()
    const [devices, setDevices] = useState([])
    const [dates, setDate] = useState({ 
        startDate: subtractDate(new Date(), 'days', 7),
        endDate: subtractDate(new Date(), 'days', 1)
    })
    const [showPopup, setShowPopup] = useState({"update": false})
    const [device, setDevice] = useState(null)
    const [isFetching, setFetching] = useState(false)

    const { data, isLoading, refetch } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    })

    const deviceClick = async (deviceData) => {
        setFetching(true)
        const showObj = {...showPopup}
        setShowPopup({...showObj, [deviceData._id]: true})
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

        setFetching(false)
    }

    if(data && data?.result.length) {
        const coords = []

        data.result.map(val => {
            if("latitude" in val && "longitude" in val) {
                coords.push({"lng": val.longitude, "lat": val.latitude})
            }
        })
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

    const handleModalChange = () => {
        let popup = {...showPopup}
        popup['update'] = !popup['update']
        
        setShowPopup(popup)
    }

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                    <h1 className="text-md">Device Monitoring</h1>
                    <Modal 
                        open={showPopup['update']} 
                        trigger={<Button size="xs">Update Device</Button>}
                        onOpenChange={handleModalChange} 
                        content={<UpdateDevice data={data} closeEvent={handleModalChange} />} 
                        title="Update Device"
                    />
                </CardHeader>
                <CardContent className={
                    cn(
                        'h-[80vh] px-4'
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
                            mapStyle="mapbox://styles/mapbox/light-v11"
                            initialViewState={{
                                longitude: 117.5371166,
                                latitude:  -2.8943844,
                                zoom: 4
                            }}
                            style={{ width: "100%", height: "78vh" }}
                            className="rounded-lg"
                            control={false}
                            projection="mercator"
                        >
                            {
                                data?.result.length ?
                                    data.result.map(val => {
                                        if("latitude" in val && "longitude" in val) {
                                            return (
                                                <div 
                                                    key={val._id}
                                                    >
                                                        <Modal 
                                                            open={showPopup[val._id]} 
                                                            trigger={<MarkerMap val={val} clickFn={deviceClick} />}
                                                            onOpenChange={() => setShowPopup(prev => prev[val._id] = false)} 
                                                            content={
                                                                !isFetching && devices && devices.length ?
                                                                    process.env.NEXT_PUBLIC_APP_MAINTENANCE ?
                                                                        <h1 className="text-red-700">[UNDER MAINTENANCE]</h1>
                                                                        :
                                                                        <Bandwith
                                                                            devices={devices}
                                                                            data={device}
                                                                            setDevice={setDevices}
                                                                        />
                                                                    : <div className="flex items-center gap-1"><CgSpinner className="animate-spin" />Getting data ...</div>
                                                            } 
                                                            title="Device Monitoring"
                                                            subTitle={"Detail's about "+ val.name +"'s device monitoring."}
                                                            className="w-[70rem] max-w-[70rem]"
                                                        />
                                                    </div>
                                            )
                                        } 
                                    })
                                : null
                            }
                        </Map>
                    </div>
                </CardContent>
            </Card>
            {/* {
                devices.length ?
                    <div className="flex gap-4 flex-col">
                        <div className="grid grid-cols-6">
                            <div className="col-span-5"></div>
                            <InputUI type="text" placeholder="Enter date ..." className="dateRange max-w-[250px]"/>
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
            } */}
        </div>
    )
}