import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUMMARY_DEVICES } from "@/contexts/actions";
import { fetchPost } from "@/lib/fetchPost";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CgSpinner } from "react-icons/cg";
import { Numeral } from "react-numeral";

export default function SummaryPage() {
    const { data, isLoading } = useQuery({
        queryKey: [SUMMARY_DEVICES],
        queryFn: () => fetchPost({
            url: '/api/device?dest=summaryDevice',
            body: {}
        }, true)
    })

    return (
        <div>
            {
                isLoading && typeof data === "undefined" ?
                <div className={cn("flex items-center gap-1")}>
                    <CgSpinner className="animate-spin" /> Getting summaries ...
                </div>
                : null
            }
            <div className={cn('relative z-10 grid gap-4 grid-cols-2 md:grid-cols-6')}>
                {
                    !isLoading && data && data?.result.length && data?.result.map(summary => {
                        return (
                            <Card className={cn(
                                ((summary?._id == "1") ? "bg-green-500" : "bg-red-600")
                            )}>
                                <CardHeader className={cn('border-b-[1px] px-4 pt-4 pb-2 mb-4 font-semibold')}>
                                    <CardTitle className={cn('text-center')}>{ summary?._id == "1" ? "ACTIVE" : "INACTIVE" }</CardTitle>
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