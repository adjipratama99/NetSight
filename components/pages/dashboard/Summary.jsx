"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUMMARY_DEVICES } from "@/contexts/actions";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Numeral } from "react-numeral";

export default function SummaryPage() {
    const [results, setResults] = useState([])
    const { data, isLoading } = useQuery({
        queryKey: [SUMMARY_DEVICES],
        queryFn: () => fetchPost({
            url: '/api/device?dest=summaryDevice',
            body: {}
        }, true)
    })

    if(data) {
        let resultData = [...data.result]
        if(!results.length) {
            let active = []
            let inactive = []
            resultData.map(data => {
                (["0", "1"].includes(data?._id)) ? active.push(data) : inactive.push(data)
            })
            inactive = inactive[0]?.total
            let total = active.reduce((a, b) => a.total + b.total) + inactive
            console.log(active)
            active = active.reduce((a, b) => a.total + b.total)
            resultData = [{ _id: "3", total }, { _id: "1", total: active }, { _id: "2", total: inactive }]
            setResults(resultData)
        }
    }

    return (
        <div>
            {
                isLoading && typeof data === "undefined" ?
                <div className={cn("flex items-center gap-1")}>
                    <CgSpinner className="animate-spin" /> Getting summaries ...
                </div>
                : null
            }
            <div className={cn('relative z-10 grid gap-2 grid-cols-3 sm:grid-cols-6 sm:gap-4')}>
                {
                    !isLoading && results.length && results.map(summary => {
                        let dataSummary = {}

                        switch(summary?._id) {
                            case "1":
                                dataSummary = { color: "bg-green-500", "title": "ACTIVE" }
                                break
                            case "2":
                                dataSummary = { color: "bg-red-600", "title": "INACTIVE" }
                                break
                            case "3":
                                dataSummary = { color: "bg-blue-600", "title": "TOTAL" }
                                break
                        }

                        return (
                            <Card className={cn(
                                dataSummary.color
                            )}
                            key={summary?._id}
                            >
                                <CardHeader className={cn('border-b-[1px] px-4 pt-4 pb-2 mb-4 font-semibold')}>
                                    <CardTitle className={cn('text-center')}>{ dataSummary.title }</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center align-items-center text-xl md:text-3xl">
                                        { <Numeral value={summary?.total} format="0,0" /> }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    )
}