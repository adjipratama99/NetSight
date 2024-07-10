import { cn } from "@/lib/utils";
import { FaUserAstronaut, FaUserSecret } from "react-icons/fa";
import { LiaUserSecretSolid } from "react-icons/lia";

export default function CopsIcon ({
    data
}) {
    if(data.deviceType === "polsek") {
        return (
            <>
                <FaUserAstronaut
                    className={
                        cn(
                            "absolute animate-ping inline-flex h-full w-full rounded-full",
                            data.status === 1 ? "text-green-500" : 'text-yellow-500'
                        )
                    }
                />
                <FaUserAstronaut 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            data.status === 1 ? "text-green-500" : 'text-red-500'
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
                            data.status === 1 ? "text-green-500" : 'text-yellow-500'
                        )
                    }
                />
                <FaUserSecret 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            data.status === 1 ? "text-green-500" : 'text-red-500'
                        )
                    }
                />
            </>
        )
    } else {
        return (
            <>
                <LiaUserSecretSolid
                    className={
                        cn(
                            "absolute animate-ping inline-flex h-full w-full rounded-full",
                            data.status === 1 ? "text-green-500" : 'text-yellow-500'
                        )
                    }
                />
                <LiaUserSecretSolid 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            data.status === 1 ? "text-green-500" : 'text-red-500'
                        )
                    }
                />
            </>
        )
    }
}