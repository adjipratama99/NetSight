"use client"

import GenerateHighcharts from "@/components/GenerateHighcharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BANDWITH_LIST } from "@/contexts/actions";
import { fetchPost } from "@/lib/fetchPost";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { CgSpinner } from "react-icons/cg";

export default function DashboardPage() {
    const { data: session } = useSession()
    const search = useSearchParams()
    const deviceId = search.get('deviceId')
    const startDate = search.get('from')
    const endDate = search.get('to')

    const { data, isLoading, error } = useQuery({
        queryKey: [BANDWITH_LIST, deviceId],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getBandwith',
            body: { deviceId, startDate, endDate }
        }, true),
        enabled: deviceId ? true : false
    })

    return (
        <Card className={data ? 'block' : 'hidden'}>
            <CardHeader className="py-2 px-4">
                <h1 className="text-xl">Monitoring Device</h1>
            </CardHeader>
            <CardContent>
                {
                    deviceId ?
                        isLoading && typeof data === "undefined" ?
                        <div className="flex items-center gap-1">
                            <CgSpinner className="animate-spin" /> Getting bandwith ...
                        </div>
                        :
                        !isLoading && data?.result?.series.length ?
                        <GenerateHighcharts type="line" data={data?.result} options={{
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                floating: true,
                                verticalAlign: 'top'
                            }
                        }} />
                        :
                        <div className="text-center italic text-muted-foreground">{ data?.message || "Data not available." }</div>
                        :
                        null
                }
            </CardContent>
        </Card>
    )
}