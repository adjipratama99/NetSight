"use client"

import { createElement } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/useSidebar'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger
} from '../ui/tooltip'

export default function SidebarMenuItem({ menu, className, ...props }) {
    const pathname = usePathname()
    const sidebar = useSidebar()
    const { data: session } = useSession()
    const menuIcon = menu?.icon ? createElement(menu?.icon) : menu.label[0]
    const menuLabel = sidebar.isOpen ? menu.label : ''
    
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Link
                        className={cn(
                            'flex items-center gap-3 w-full p-3 text-foreground/60 text-sm h-full rounded-md hover:bg-primary/10 hover:text-primary',
                            ('/'+ pathname.split('/')[1] === menu.link ? 'text-primary bg-primary/10' : ''),
                            (!sidebar.isOpen ? 'justify-center' : ''),
                            className
                        )}
                        href={menu.link}
                        {...props}
                    >
                        <div>
                            {session?.token ? menuIcon : <Skeleton className="w-3 h-3" />}
                        </div>
                        {session?.token ? menuLabel : <Skeleton className="w-full h-3" />}
                    </Link>
                </TooltipTrigger>
                <TooltipContent
                    className={cn(
                        "bg-primary text-primary-foreground",
                        (sidebar.isOpen ? 'hidden' : '')
                    )}
                    side="right"
                >
                    {menu.label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}