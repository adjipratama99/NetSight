import GenerateHighcharts from "@/components/GenerateHighcharts";
import { FaSquare, FaTimes } from "react-icons/fa";
import { chartColor } from "@/lib/Constants";
import { formatBytes, percentageOf } from "@/lib/Helper";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetchPost";
import { BANDWITH_LIST } from "@/contexts/actions";
import AirDatepicker from "air-datepicker";
import localeEn from 'air-datepicker/locale/en'
import { format } from "date-fns";
import InputUI from "@/components/customs/forms/input";

export default function Bandwith({ currentData, dates, isReport }) {
    const [total, setTotal] = useState([]),
    [average, setAverage] = useState([]),
    [max, setMax] = useState([]),
    [min, setMin] = useState([])
    const [bodyParams, setBodyParams] = useState({ "deviceId": currentData?._id, ...dates })

    const { data, isLoading, refetch } = useQuery({
        queryKey: [BANDWITH_LIST],
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
                    let total = val?.data ? val?.data.reduce((partialSum, a) => partialSum + a, 0) : 0
                    prevTotal[ind] = total
                    prevAverage[ind] = val?.data ? total / val?.data.length : 0
                    prevMax[ind] = val?.data ? Math.max(...val?.data) : 0
                    prevMin[ind] = val?.data ? Math.min(...val?.data) : 0
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

        if(data && data?.result?.series.length) {
            new AirDatepicker(".dateRange", {
                startDate: dates.startDate,
                range: true,
                locale: localeEn,
                selectedDates: [dates.startDate, dates.endDate],
                dateFormat: 'yyyy-MM-dd',
                minDate: format(new Date(), 'yyyy') +'-01-01',
                maxDate: format(new Date(), 'yyyy-MM-dd'),
                multipleDatesSeparator: ' - ',
                isMobile: true,
                visible: false,
                onSelect: ({ formattedDate }) => {
                    if(formattedDate.length == 2) {
                        let params = {...bodyParams, 
                            startDate: formattedDate[0] + ' '+ format(new Date(), 'HH:mm:ss'),
                            endDate: formattedDate[1] + ' '+ format(new Date(), 'HH:mm:ss')
                        }
                        setBodyParams(params)
                        refetch()
                    }
                }
            })
        }
    }, [data])

    return (
        <div className="flex flex-col gap-4 bg-neutral-100 p-4 rounded-lg w-full">
            <InputUI 
                type="text" 
                placeholder="Enter date ..." 
                className="dateRange max-w-[250px] mr-5"
                size="xs"
            />
            {
                process.env.NEXT_PUBLIC_APP_MAINTENANCE ?
                    <div className="text-2xl text-red-700">[UNDER MAINTENANCE]</div>
                :
                <>
                    {
                        isReport ?
                        <div className="text-md mb-4">{ data.deviceName }</div>
                        : null
                    }
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
                </>
            }
        </div>
    )
}