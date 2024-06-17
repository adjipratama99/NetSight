'use client'

import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import SidebarMenuItem from '@/components/layout/SidebarMenuItem'
import { useSidebar } from '@/contexts/useSidebar'
import getMenu from '@/config/menu'


export default function SidebarMenuList({ className, ...props }) {
    const { data: session } = useSession()

    const sidebar = useSidebar()
    const isAdmin = session?.token?.role === 'admin'
    const isUser = session?.token?.role === 'user'
    const isOperator = session?.token?.role === 'operator'
    const menus = getMenu({ isAdmin, isOperator, isUser })

    return (
        <ul className={cn('flex flex-col justify-stretch gap-2', className)} {...props}>
            {menus.map((menu) => {
                if (menu.hidden) return null
                    
                if (menu?.type === 'group') {
                    if(menu?.accessList.some(data => session?.token?.feature?.includes(data))) {
                        return (
                            <li key={menu.name} className="mb-3">
                                {sidebar.isOpen ? <h5 className="capitalize text-xs">{menu.name}</h5> : null}
                                <ol className="py-3 border-b-[1px]">
                                    {menu?.children?.map((child) => {
                                        if(session?.token?.feature.includes(child?.accessKey)) {
                                            return (
                                                <li
                                                    key={child.link}
                                                    className="flex items-center gap-2 h-8"
                                                >
                                                    <SidebarMenuItem menu={child} />
                                                </li>
                                            )
                                        }
                                    })}
                                </ol>
                            </li>
                        )
                    }
                }
            })}
        </ul>
    )
}