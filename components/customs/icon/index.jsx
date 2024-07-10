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
                            parseInt(data.status) === 1 ? "text-lime-600" : 'text-yellow-600'
                        )
                    }
                />
                <FaUserAstronaut 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            parseInt(data.status) === 1 ? "text-lime-600" : 'text-red-600'
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
                            parseInt(data.status) === 1 ? "text-green-600" : 'text-yellow-600'
                        )
                    }
                />
                <FaUserSecret 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            parseInt(data.status) === 1 ? "text-green-600" : 'text-red-600'
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
                            parseInt(data.status) === 1 ? "text-cyan-600" : 'text-yellow-600'
                        )
                    }
                />
                <LiaUserSecretSolid 
                    className={
                        cn(
                            "relative inline-flex rounded-full",
                            parseInt(data.status) === 1 ? "text-cyan-600" : 'text-red-600'
                        )
                    }
                />
            </>
        )
    }
}