import GenerateHighcharts from "@/components/GenerateHighcharts";
import { BANDWITH_LIST } from "@/contexts/actions";
import { chartColor } from "@/lib/Constants";
import { fetchPost } from "@/lib/fetchPost";
import { formatBytes } from "@/lib/Helper";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Highcharts from 'highcharts'
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaSquare } from "react-icons/fa";

export default function BandwithReport({ params }) {
    const [total, setTotal] = useState([]),
    [average, setAverage] = useState([]),
    [max, setMax] = useState([]),
    [min, setMin] = useState([])
    
    const { data, isLoading } = useQuery({
        queryKey: [BANDWITH_LIST, params],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getBandwith',
            body: params
        }, true)
    })

    if(data && !isLoading) {
        let prevTotal = [...total]
        let prevAverage = [...total]
        let prevMax = [...total]
        let prevMin = [...total]

        if(data?.result?.series[0]?.data) {
            data?.result?.series.map((val, ind) => {
                let total = val?.data && val?.data.length ? val?.data.reduce((partialSum, a) => partialSum + a, 0) : 0
                prevTotal[ind] = total
                prevAverage[ind] = val?.data && val?.data.length ? total / val?.data.length : 0
                prevMax[ind] = val?.data && val?.data.length ? Math.max(...val?.data) : 0
                prevMin[ind] = val?.data && val?.data.length ? Math.min(...val?.data) : 0
            })
        }

        if(!total.length) setTotal(prevTotal)
        if(!average.length) setAverage(prevAverage)
        if(!max.length) setMax(prevMax)
        if(!min.length) setMin(prevMin)
    }

    return (
        isLoading && typeof data === "undefined" ?
            <div className={cn("flex items-center gap-1")}>
                <CgSpinner className="animate-spin" />Getting bandwith ...
            </div>
        :
        data && data?.result?.series ?
        <>
            <div className="h-[300px]">
                <GenerateHighcharts type="line" data={data?.result} options={{
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        floating: true,
                        verticalAlign: 'top'
                    },
                    yAxis: {
                        dataLabels: {
                            formatter: function() {
                                if (this.y > 1000000) {
                                return Highcharts.numberFormat(this.y / 1000, 3) + "M"
                                } else if (this.y > 1000) {
                                return Highcharts.numberFormat(this.y / 1000, 3) + "K";
                                } else {
                                return this.y
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter() {
                            return `<div>${ format(new Date(this.x * 1000), 'dd MMM yyyy HH:mm:ss') }</div><br />
                                    <div class="font-semibold"> ${ this.point?.series?.name } </div><br /><br />
                                    <div class="flex items-center gap-2">
                                        <div>Total:</div>
                                        <div class="font-semibold tx-12">${ formatBytes(this.y).val +' '+ formatBytes(this.y).unit }</div>
                                    </div>
                                `
                        }
                    }
                }} />
            </div>
            <div className="flex gap-4 flex-col ml-[30px]">
                <div className="grid grid-cols-5 items-center gap-2">
                    <div className="flex items-center gap-1">
                        <FaSquare className={cn("self-start mt-2")} style={{color: chartColor()[0]}} />
                        Uplink
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Average: </span>
                        { average[0] ? (formatBytes(average[0]).val +' '+ formatBytes(average[0]).unit) : 0 +' Byte' }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Max: </span>
                        { max[0] ? (formatBytes(max[0]).val +' '+ formatBytes(max[0]).unit) : 0 +' Byte' }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Min: </span>
                        { min[0] ? (formatBytes(min[0]).val +' '+ formatBytes(min[0]).unit) : 0 +' Byte' }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Total: </span>
                        { total[0] ? (formatBytes(total[0]).val +' '+ formatBytes(total[0]).unit) : 0 +' Byte' }
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    <div className="flex items-center gap-1">
                        <FaSquare className={cn("self-start mt-2")} style={{color: chartColor()[1]}} />
                        Downlink
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Average: </span>
                        { average[1] ? (formatBytes(average[1]).val +' '+ formatBytes(average[1]).unit) : 0 +' Byte' }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Max: </span>
                        { max[1] ? (formatBytes(max[1]).val +' '+ formatBytes(max[1]).unit) : 0 +' Byte' }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Min: </span>
                        { min[1] ? (formatBytes(min[1]).val +' '+ formatBytes(min[1]).unit) : 0 +' Byte' }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Total: </span>
                        { total[1] ? (formatBytes(total[1]).val +' '+ formatBytes(total[1]).unit) : 0 +' Byte' }
                    </div>
                </div>
            </div>
        </>
        : <div className="text-xl text-center italic text-slate-400">- Data not available -</div>
    )
}