'use client'

import { cn } from '@/lib/utils'
import Toolbar from '../customs/toolbar'
import Title from '../customs/title'
import { useSession } from 'next-auth/react'
import UserAvatar from './UserAvatar'
import getMenu from '@/config/menu'
import { randNumber } from '@/lib/Helper'
import ListItem from './ListItem'
import Link from 'next/link'

export default function Header({ width, className, ...props }) {
    const { data: session } = useSession()
    const isAdmin = session?.token?.role === 'admin'
    const isUser = session?.token?.role === 'user'
    const isOperator = session?.token?.role === 'operator'
    const menus = getMenu({ isAdmin, isOperator, isUser })

    return (
        <header className={cn(
                className
            )}
        >
            <Toolbar className={cn('flex justify-between items-center px-4 py-2 sticky')}>
                <Link
                    href="/"
                ><Title variant="danger" size="sm" /></Link>
                <UserAvatar />
            </Toolbar>
        </header>
    )
}