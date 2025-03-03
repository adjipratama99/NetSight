"use client"

import Bandwith from "@/components/pages/dashboard/Bandwith";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DEVICES_LIST } from "@/contexts/actions";
import { findCenter, subtractDate } from "@/lib/Helper";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useSidebar } from "@/contexts/useSidebar";
import { useMap, Marker, Popup } from "react-map-gl";
import { Map } from "@/components/customs/maps";
import { Modal } from "@/components/customs/modal";
import { Button } from "@/components/ui/button";
import UpdateDevice from "@/components/forms/UpdateDevice";
import CopsIcon from "@/components/customs/icon";
import Legends from "@/components/customs/maps/legends";
import { format } from "date-fns";
import SummaryPage from "@/components/pages/dashboard/Summary";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { useSession } from "next-auth/react";
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
                        <CopsIcon data={val} />
                    </span>
            </Marker>
        </>
    )
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const sidebar = useSidebar()
    const { MapDevice } = useMap()
    const [dates, setDate] = useState({ 
        startDate: format(subtractDate(new Date(), 'years', 1), 'yyyy-MM-dd 00:00:00'),
        endDate: format(new Date(), 'yyyy-MM-dd 23:59:59')
    })
    const [showPopup, setShowPopup] = useState({"update": false})

    const { data, isLoading, refetch } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    })

    const deviceClick = async (deviceData) => {
        const showObj = {...showPopup}
        setShowPopup({...showObj, [deviceData._id]: true})
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
        refetchRequest()
    }, [sidebar])

    const handleModalChange = () => {
        let popup = {...showPopup}
        popup['update'] = !popup['update']
        
        setShowPopup(popup)
    }

    return (
        <div className="flex flex-col gap-4">
            {
                !session?.token?.access.includes("dashboard") ?
                    <div className="flex flex-col gap-4 items-center justify-center h-[80vh]">
                        <Image
                            src={require("@/public/forbidden.png")}
                            alt="403 Forbidden"
                            className="self-center"
                            width={256}
                        />
                        <h1 className="text-2xl">You do not have permission to access this page.</h1>
                        <Button
                            size="icon"
                            className="group size-8 w-auto transition-all hover:justify-start gap-2 px-2 rounded-lg"
                            onClick={() => location.replace('/')}
                        ><FaHome /> Go back to Home</Button>
                    </div>
                :
                <>
                    <SummaryPage />
                    <Card className="mb-4">
                        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                            <div className="text-xs md:text-md">Device Monitoring</div>
                            {
                                (!parseInt(process.env.NEXT_PUBLIC_HIDE_UPDATE_DEVICE) && session?.token?.role !== "user") && <Modal 
                                open={showPopup['update']} 
                                trigger={<Button size="xs" className="text-xs md:text-sm">Update Device</Button>}
                                onOpenChange={handleModalChange} 
                                content={<UpdateDevice data={data} closeEvent={handleModalChange} />} 
                                title="Update Device"
                            />
                            }
                        </CardHeader>
                        <CardContent className={
                            cn(
                                'h-[81vh] md:h-[80vh] px-4'
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
                                    style={{ width: "100%", height: "75vh" }}
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
                                                                        <Bandwith
                                                                            dates={dates}
                                                                            currentData={val}
                                                                        />
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
                                <Legends />
                            </div>
                        </CardContent>
                    </Card>
                </>
            }
        </div>
    )
}