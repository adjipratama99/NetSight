import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GenerateHighcharts from "@/components/GenerateHighcharts";
import { FaSquare, FaTimes } from "react-icons/fa";
import { chartColor } from "@/lib/Constants";
import { formatBytes, percentageOf } from "@/lib/Helper";
import { useEffect, useState } from "react";

export default function Bandwith({ data, devices, isReport }) {
    const currentData = !isReport ? devices.filter(device => device.id !== data.id)[0] : devices.filter(device => device.id === data.id)[0].result
    const { result } = currentData
    const [total, setTotal] = useState([]),
    [average, setAverage] = useState([]),
    [max, setMax] = useState([]),
    [min, setMin] = useState([])

    const getSummary = () => {
        let prevTotal = [...total]
        let prevAverage = [...total]
        let prevMax = [...total]
        let prevMin = [...total]

        result.series.map((val, ind) => {
            let total = val.data.reduce((partialSum, a) => partialSum + a, 0)
            prevTotal[ind] = total
            prevAverage[ind] = total / val.data.length
            prevMax[ind] = Math.max(...val.data)
            prevMin[ind] = Math.min(...val.data)
        })

        setTotal(prevTotal)
        setAverage(prevAverage)
        setMax(prevMax)
        setMin(prevMin)
    }

    useEffect(() => {
        getSummary()
    }, [])

    return (
        <div className="flex flex-col gap-4 bg-neutral-100 p-4 rounded-lg w-full">
            <div className="h-[300px]">
                <GenerateHighcharts type="line" data={result} options={{
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        floating: true,
                        verticalAlign: 'top'
                    }
                }} />
            </div>
            <div className="flex gap-4 flex-col ml-[30px]">
                <div className="grid grid-cols-5 gap-2">
                    <div className="flex items-center gap-1">
                        <FaSquare style={{color: chartColor()[0]}} />
                        Uplink
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Average: </span>
                        { formatBytes(average[0]).val +' '+ formatBytes(average[0]).unit }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Max: </span>
                        { formatBytes(max[0]).val +' '+ formatBytes(max[0]).unit }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Min: </span>
                        { formatBytes(min[0]).val +' '+ formatBytes(min[0]).unit }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Total: </span>
                        { formatBytes(total[0]).val +' '+ formatBytes(total[0]).unit }
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    <div className="flex items-center gap-1">
                        <FaSquare style={{color: chartColor()[1]}} />
                        Downlink
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Average: </span>
                        { formatBytes(average[1]).val +' '+ formatBytes(average[1]).unit }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Max: </span>
                        { formatBytes(max[1]).val +' '+ formatBytes(max[1]).unit }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Min: </span>
                        { formatBytes(min[1]).val +' '+ formatBytes(min[1]).unit }
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Total: </span>
                        { formatBytes(total[1]).val +' '+ formatBytes(total[1]).unit }
                    </div>
                </div>
            </div>
        </div>
    )
}