import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export const inputVariants = cva('rounded-lg bg-neutral-800 text-neutral-300 border-neutral-700 focus:bg-neutral-700 focus:text-neutral-300', {
        variants: {
            size: {
                default: 'h-10 text-[16px]',
                xs: 'h-4 text-[12px]',
                sm: 'h-8 text-[14px]',
                lg: 'h-12 text-[18px]',
                sm: 'h-14 text-[20px]',
            }
        },
        defaultVariants: {
            size: 'default'
        }
    }
)

export default function InputUI({ className, type, size, ...props }) {
    return <Input 
            type={type}
            className={cn(inputVariants({ size, className }))}
            {...props}
            />
}