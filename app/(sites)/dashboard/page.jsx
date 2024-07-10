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
import { FaUserAlt, FaUserNurse, FaUserSecret } from "react-icons/fa";
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
    const sidebar = useSidebar()
    const { MapDevice } = useMap()
    const [dates, setDate] = useState({ 
        startDate: subtractDate(new Date(), 'days', 7),
        endDate: subtractDate(new Date(), 'days', 1)
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
            <Card>
                <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                    <h1 className="text-md">Device Monitoring</h1>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1">
                            <FaUserAlt className="text-violet-600" />
                            Polsek
                        </div>
                        <div className="flex items-center gap-1">
                            <FaUserSecret className="text-green-600" />
                            Polda
                        </div>
                        <div className="flex items-center gap-1">
                            <FaUserNurse className="text-cyan-600" />
                            Polres
                        </div>
                    </div>
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}