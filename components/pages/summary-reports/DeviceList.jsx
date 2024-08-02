"use client"

import ComboBox from "@/components/customs/forms/combobox";
import { DEVICES_LIST } from "@/contexts/actions";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

export default function DeviceList({ changeEvent }) {
    const [comboOpen, setComboOpen] = useState(false)
    const { data, isLoading } = useQuery({
        queryKey: [DEVICES_LIST],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getDevices',
            body: {}
        }, true)
    })

    return (
        isLoading && typeof data === "undefined" ?
            <div className={cn("flex items-center gap-1")}>
                <CgSpinner className="animate-spin" />Getting devices ...
            </div>
        :
            <div className={cn("h-[50vh] overflow-y-scroll")}>
                <ComboBox
                    fullWidth
                    onSelect={(val) => {
                        changeEvent(val, data?.result)
                        setComboOpen(false)
                    }}
                    placeholder="Select device"
                    open={comboOpen}
                    onOpenChange={setComboOpen}
                    opts={
                        data.result.map(device => { return { "value": device._id +'|'+ device.name, "label": device.name } })
                    }
                />
            </div>
    )
}