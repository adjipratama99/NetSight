"use client"

import BandwithReport from "@/components/pages/summary-reports/Bandwith";
import DeviceList from "@/components/pages/summary-reports/DeviceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sleep, subtractDate } from "@/lib/Helper";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { DateRangePicker } from "rsuite";
const { allowedRange } = DateRangePicker

export default function SummaryReports() {
    const [selected, setSelected] = useState(null)
    const [data, setData] = useState([])
    const [dates, setDates] = useState({ startDate: subtractDate(new Date(), 'months', 5), endDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss') })
    const targetRef = useRef()
    const [ind, setInd] = useState(0)
    const [trigger, setTrigger] = useState(false)
    
    const deviceSelected = (deviceId, res) => {
        let dataRes = deviceId.split('|')
        setSelected({ "_id": dataRes[0], "name": dataRes[1] })
        if(res) setData(res)
        setTimeout(() => setTrigger(true), 4000)
    }

    const options = {
        resolution: Resolution.HIGH,
        page: {
           margin: Margin.SMALL,
           orientation: 'landscape',
        },
        canvas: {
           qualityRatio: 1
        },
        filename: "Summary-Report-"+ selected?.name +'-'+ format(new Date(), 'yyyy-MM-dd HH:mm:ss') +'.pdf'
    };

    useEffect(() => {
        if(trigger) {
            const downloadPdf = () => {
                generatePDF(targetRef, options)
                let newIndex = ind + 1
                if(data[newIndex]) {
                    setInd(newIndex)
                    let device = data[newIndex]._id +'|'+ data[newIndex].name
                    setSelected(null)
                    setTimeout(() => {
                        deviceSelected(device)
                        setTrigger(false)
                    }, 2000)
                }
            }
    
            downloadPdf()
        }
    }, [trigger])

    return (
        <div className={cn("flex gap-4")}>
            <Card>
                <CardContent className={cn("pt-2 flex flex-col gap-4")}>
                    <DateRangePicker
                        defaultValue={[parseISO(dates.startDate), parseISO(dates.endDate)]}
                        block
                        disabledDate={allowedRange(subtractDate(new Date(), 'months', 5), format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}
                        onOk={(value) => {
                            setDates({ startDate: format(value[0], 'yyyy-MM-dd HH:mm:ss'), endDate: format(value[1], 'yyyy-MM-dd HH:mm:ss') })
                        }}
                        className="w-[250px]"
                    />
                    <DeviceList changeEvent={deviceSelected} />
                </CardContent>
            </Card>
            {
                selected ?
                 <Card className={cn("grow")} ref={targetRef}>
                    <CardHeader className={cn("space-y-0 text-center")}>
                        <CardTitle className={cn("text-xl")}>NetSight</CardTitle>
                        <CardDescription className={cn("text-md font-normal text-dark")}>
                            Device <span className={cn("font-semibold")}>"{ selected.name }"</span> Usage <br />
                            on <span className={cn("font-semibold")}>{ dates.startDate } - { dates.endDate }</span>
                        </CardDescription>
                        <CardContent><BandwithReport params={{ deviceId: selected._id, ...dates }} /></CardContent>
                    </CardHeader>
                </Card> : null
            }
        </div>
    )
}