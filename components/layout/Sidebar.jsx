"use client"

import { DEVICES_LIST, DEVICE_LIST, SIDEBAR_CLOSE, SIDEBAR_OPEN } from "@/contexts/actions"
import { useSidebar, useSidebarDispatch } from "@/contexts/useSidebar"
import { Button } from "../ui/button"
import Title from "../customs/title"
import Toolbar from "../customs/toolbar"
import { cn } from "@/lib/utils"
import UserAvatar from "./UserAvatar"
import SidebarMenuList from "./SidebarMenuList"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import { fetchPost } from "@/lib/fetchPost"
import { useRouter, useSearchParams } from "next/navigation"
import { CgSpinner } from "react-icons/cg"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import Link from "next/link"
import { IoServer } from 'react-icons/io5';
import { format } from "date-fns"
import { subtractDate } from "@/lib/Helper"

export default function Sidebar({ className, ...props }) {
    const router = useRouter()
    const { data: session } = useSession()
    const sidebar = useSidebar()
    const dispatch = useSidebarDispatch()
    /* const searchParams = useSearchParams()
    const deviceId = searchParams.get('deviceId')
    
    const { data, isLoading, error } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    }) */

    const handleToggleSidebar = () => {
        dispatch({
            type: sidebar.isOpen
                    ? SIDEBAR_CLOSE
                    : SIDEBAR_OPEN
        })
    }

    return (
        <aside
            className={cn(
                `flex flex-col fixed top-0 bottom-0 z-40 h-[94vh] mt-[1.5rem] ml-[2rem] rounded-xl border border-red-600 px-2 bg-neutral-900 backdrop-blur-lg`,
                'md:sticky md:from-primary/10',
                (sidebar.isOpen ? 'min-w-[250px] left-0' : '-left-[250px] w-0 min-w-max'),
                className
            )}
            {...props}
        >
            <Toolbar
                className={cn(
                    "relative hidden md:flex items-center justify-center",
                )}
            >
                <Button
                    variant="ghost"
                    className="flex items-center gap-3"
                >
                    {sidebar.isOpen
                        ? <Title size="sm" variant="danger" />
                        : ''
                    }
                </Button>
                <Button
                    variant="outline"
                    className={cn(
                        "flex items-center justify-center bg-neutral-900 hover:bg-red-700 border-red-700 hover:text-slate-300",
                        "absolute top-1/2 -right-2",
                        "transform -translate-y-1/2 translate-x-1/2",
                        "size-8 p-0 rounded-full"
                    )}
                    onClick={handleToggleSidebar}
                >
                    {sidebar.isOpen
                        ? <FaChevronLeft className="text-foreground text-sm" />
                        : <FaChevronRight className="text-foreground text-sm" />
                    }
                </Button>
            </Toolbar>
            <div className="px-2">
                <UserAvatar />
            </div>
            {/* <ul className="flex flex-col justify-stretch gap-2 flex-1 w-full md:top-[5rem] max-h-full overflow-scroll px-2">
                    {
                        isLoading && typeof data === "undefined" ?
                            <div className="flex items-center gap-1">
                                <CgSpinner className="mr-2 animate-spin" /> Getting devices...
                            </div>
                        :
                        !isLoading && data?.result?.length ?
                            <li className="mb-3">
                                {sidebar.isOpen ? <h5 className="capitalize text-xs">Device List</h5> : null}
                                <ol className="py-3">
                                    {
                                        data.result.map(device => {
                                            const menuLabel = sidebar.isOpen ? device.name : ''

                                            return (
                                                <li key={device._id} className="flex items-center gap-2 h-8">
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={200}>
                                                            <TooltipTrigger asChild>
                                                                <Link
                                                                    className={cn(
                                                                        'flex items-center gap-3 w-full p-3 text-slate-400/60 text-[12px] h-full rounded-md hover:bg-slate-600/10 hover:text-slate-300',
                                                                        (deviceId === device._id ? 'text-slate-300 bg-slate-600/10' : ''),
                                                                        (!sidebar.isOpen ? 'justify-center' : '')
                                                                    )}
                                                                    href="#"
                                                                    onClick={(e) => serverSelected(e, device._id)}
                                                                >
                                                                    <div>
                                                                        {session?.token ? <IoServer /> : <Skeleton className="w-3 h-3" />}
                                                                    </div>
                                                                    {session?.token ? menuLabel : <Skeleton className="w-full h-3" />}
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                            className={cn(
                                                                (sidebar.isOpen ? 'hidden' : '')
                                                            )}
                                                            side="right">
                                                                {device.name}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </li>
                                            )
                                        })
                                    }
                                </ol>
                            </li>
                        :
                        <div className="text-slate-400 text-center">{error || "Device not found."}</div>
                    }
            </ul> */}
            <SidebarMenuList className="flex-1 w-full md:top-[5rem] max-h-full overflow-scroll px-2" />
        </aside>
    )
}