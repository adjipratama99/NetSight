"use client"

import { useSession } from 'next-auth/react'
import { SlLogout } from 'react-icons/sl'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'


export default function UserAvatar() {
    const { data: session } = useSession()

    return (
        <div className={cn(
            "flex items-center justify-between cursor-pointer rounded-md pb-3 gap-2 px-3"
        )}>
            <Button
                size="icon"
                variant="danger"
                className="group size-8 w-auto transition-all hover:justify-start gap-2 px-2 rounded-lg"
                onClick={() => signOut()}
            >
                <SlLogout size={10} />
                <p className="capitalize text-sm">{session?.token?.username || '-'}</p>
            </Button>
        </div>
    )
}