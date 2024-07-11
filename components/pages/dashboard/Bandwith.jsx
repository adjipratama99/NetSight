import GenerateHighcharts from "@/components/GenerateHighcharts";
import { FaSquare, FaTimes } from "react-icons/fa";
import { chartColor } from "@/lib/Constants";
import { formatBytes, percentageOf, subtractDate } from "@/lib/Helper";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetchPost";
import { BANDWITH_LIST } from "@/contexts/actions";
import { DateRangePicker } from "rsuite";
import { format, parseISO } from "date-fns";
const { allowedRange } = DateRangePicker

export default function Bandwith({ currentData, dates, isReport }) {
    const [total, setTotal] = useState([]),
    [average, setAverage] = useState([]),
    [max, setMax] = useState([]),
    [min, setMin] = useState([])
    const [bodyParams, setBodyParams] = useState({ "deviceId": currentData?._id, ...dates })

    const { data, isLoading } = useQuery({
        queryKey: [BANDWITH_LIST, bodyParams],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getBandwith',
            body: bodyParams
        }, true)
    })

    const getSummary = () => {
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
    
            setTotal(prevTotal)
            setAverage(prevAverage)
            setMax(prevMax)
            setMin(prevMin)
        }
    }

    useEffect(() => {
        getSummary()
    }, [data])
    
    return (
        <div className="flex flex-col gap-4 bg-neutral-100 p-4 rounded-lg w-full">
            {
                !isReport ?
                    <div className="flex justify-end">
                        <DateRangePicker
                            defaultValue={[parseISO(dates.startDate), parseISO(dates.endDate)]}
                            block
                            disabledDate={allowedRange(subtractDate(new Date(), 'years', 1), format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
                            onOk={(value) => {
                                let params = {...bodyParams, startDate: format(value[0], 'yyyy-MM-dd HH:mm:ss'), endDate: format(value[1], 'yyyy-MM-dd HH:mm:ss')}
                                setBodyParams(params)
                            }}
                            className="w-[250px]"
                        />
                    </div> : false
            }

            {
                parseInt(process.env.NEXT_PUBLIC_APP_MAINTENANCE) ?
                    <div className="text-2xl text-center text-red-700">[UNDER MAINTENANCE]</div>
                :
                <>
                    {
                        isReport ?
                        <div className="text-md mb-4">{ currentData.deviceName }</div>
                        : null
                    }
                    {
                        data && data?.result?.series ?
                        <>
                            <div className="h-[300px]">
                                <GenerateHighcharts type="line" data={data?.result} options={{
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
                                        <FaSquare style={{color: chartColor()[1]}} />
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
                        : null
                    }
                </>
            }
        </div>
    )
}