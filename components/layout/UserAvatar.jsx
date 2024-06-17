"use client"

import { useSession } from 'next-auth/react'
import { PiUserCircle, } from 'react-icons/pi'
import { SlLogout } from 'react-icons/sl'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { useSidebar } from '@/contexts/useSidebar'
import { cn } from '@/lib/utils'


export default function UserAvatar() {
    const { data: session } = useSession()
    const sidebar = useSidebar()

    return (
        <div className={cn(
            "flex items-center justify-between cursor-pointer rounded-md pb-3",
            !sidebar.isOpen ? 'px-3' : ''
        )}>
            <div className="flex items-center gap-2">
                <PiUserCircle size={20} />
                {sidebar.isOpen
                    ? <p className="capitalize text-sm">{session?.token?.username || '-'}</p>
                    : null
                }
            </div>
           {sidebar.isOpen ? <Button
                size="icon"
                variant="danger"
                className="group size-8 hover:w-auto transition-all hover:justify-start gap-2 hover:px-2 rounded-lg"
                onClick={() => signOut()}
            >
                <SlLogout size={10} />
                <p className="hidden opacity-0 group-hover:block group-hover:opacity-100">
                    Logout
                </p>
            </Button> : null}
        </div>
    )
}