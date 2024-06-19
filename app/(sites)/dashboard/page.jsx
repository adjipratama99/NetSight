"use client"

import GenerateHighcharts from "@/components/GenerateHighcharts";
import Bandwith from "@/components/pages/dashboard/Bandwith";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BANDWITH_LIST, DEVICES_LIST } from "@/contexts/actions";
import { subtractDate } from "@/lib/Helper";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoServer } from "react-icons/io5";
import { FiMaximize2 } from 'react-icons/fi';
import { useSidebar } from "@/contexts/useSidebar";

export default function DashboardPage() {
    const sidebar = useSidebar()
    const [devices, setDevices] = useState([])
    const [dates, setDate] = useState({ 
        startDate: subtractDate(new Date(), 'days', 7),
        endDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
     })
    const [isMinimize, setMinimize] = useState(false)

    const { data, isLoading, error } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    })

    const deviceClick = async (deviceId, deviceName) => {
        const existing = devices.find(data => data.id === deviceId)

        if(!existing) {
            const req = await fetchPost({
                url: '/api/device?dest=getBandwith',
                body: { deviceId, ...dates }
            }, true)
    
            setDevices(prev => [...prev, {id: deviceId, name: deviceName, result: req.result}])
        }
    }

    const minimizeMaximize = () => setMinimize(prev => !prev)

    useEffect(() => {
        setDevices(prev => prev)
    }, [sidebar])

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="py-2 px-4 mb-4 flex flex-row items-center justify-between">
                    <h1 className="text-md">Devices</h1>
                    <span className="text-red-500 cursor-pointer" onClick={minimizeMaximize}>
                        { isMinimize ? <FiMaximize2 /> : <FaRegWindowMinimize /> }
                    </span>
                </CardHeader>
                <CardContent className={
                    cn(
                        isMinimize ? "animate animate-slideOutUp animate-fast hidden" : ""
                    )
                }>
                    {
                        isLoading && typeof data === "undefined" ?
                        <div className="flex items-center gap-1">
                            <CgSpinner className="animate-spin" /> Getting devices ...
                        </div>
                        :
                        !isLoading && data?.result?.length ?
                            <div className="grid grid-cols-6 gap-2 max-h-[83vh] overflow-y-scroll">
                                {
                                    data.result.map(device => (
                                        <Card key={device._id} onClick={() => deviceClick(device._id, device.name)} className="cursor-pointer">
                                            <CardContent className="flex items-center p-2 justify-center gap-2 flex-col">
                                                { device.status ? <IoServer className="text-green-500 text-xl" /> : <IoServer className="text-red-500 text-xl" /> }
                                                <span className="text-[12px]">{ device.name }</span>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>
                        :
                        <div className="text-center italic text-muted-foreground">{ data?.message || "Data not available." }</div>
                    }
                </CardContent>
            </Card>
            {
                devices.length ?
                    devices.map(device => (
                        <Bandwith 
                        key={device.id} 
                        data={device} 
                        setDevice={setDevices}
                         />
                    ))
                : null
            }
        </div>
    )
}