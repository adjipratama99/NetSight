import { cn } from '@/lib/utils'

export default function Toolbar({ children, className, ...props }) {
    return (
        <div
            className={cn('container-fluid flex items-center h-16 md:h-20 py-2', className)}
            {...props}
        >
            {children}
        </div>
    )
}