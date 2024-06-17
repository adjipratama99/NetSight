import { Initials } from "@/lib/Helper"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const titleVariants = cva(
    "mb-4 rounded-lg bg-slate-400 bg-gradient-to-r font-bold text-black mix-blend-screen px-4 py-1", {
        variants: {
            variant: {
                default: "from-slate-600 to-slate-800 to-slate-900",
                primary: "from-blue-600 to-blue-800 to-blue-900",
                danger: "from-red-600 to-red-800 to-red-900",
                warning: "from-yellow-600 to-yellow-800 to-yellow-900",
                info: "from-cyan-600 to-cyan-800 to-cyan-900"
            },
            size: {
                default: "text-2xl",
                xs: "text-sm",
                sm: "text-lg",
                md: "text-xl",
                lg: "text-3xl",
                xl: "text-4xl"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

export default function Title({ size, variant, useAnimate, useInitials, className, ...props }) {
    return (
        <h1 className={cn(titleVariants({size, variant, className}), useAnimate ? 'animate-slidein' : '')} {...props}>
            { useInitials ? Initials(process.env.NEXT_PUBLIC_APP_NAME) : process.env.NEXT_PUBLIC_APP_NAME }
        </h1>
    )
}