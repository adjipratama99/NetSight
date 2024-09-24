import { cn } from "@/lib/utils";
import { FaUserAlt, FaUserNurse, FaUserSecret } from "react-icons/fa";

export default function CopsIcon ({
    data
}) {
    if(data.deviceType === "polsek") {
        return (
            <>
                <FaUserAlt
                    className={
                        cn(
                            "absolute animate-ping inline-flex h-full w-full rounded-full",
                            [0, 1].includes(parseInt(data?.status)) ? "text-violet-600" : 'text-yellow-600'
                        )
                    }
                />
                <FaUserAlt 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            [0, 1].includes(parseInt(data?.status)) ? "text-violet-600" : 'text-red-600'
                        )
                    }
                />
            </>
        )
    } else if(data.deviceType === "polda") {
        return (
            <>
                <FaUserSecret
                    className={
                        cn(
                            "absolute animate-ping inline-flex h-full w-full rounded-full",
                            [0, 1].includes(parseInt(data?.status)) ? "text-green-600" : 'text-yellow-600'
                        )
                    }
                />
                <FaUserSecret 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            [0, 1].includes(parseInt(data?.status)) ? "text-green-600" : 'text-red-600'
                        )
                    }
                />
            </>
        )
    } else {
        return (
            <>
                <FaUserNurse
                    className={
                        cn(
                            "absolute animate-ping inline-flex h-full w-full rounded-full",
                            [0, 1].includes(parseInt(data?.status)) ? "text-cyan-600" : 'text-yellow-600'
                        )
                    }
                />
                <FaUserNurse 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            [0, 1].includes(parseInt(data?.status)) ? "text-cyan-600" : 'text-red-600'
                        )
                    }
                />
            </>
        )
    }
}