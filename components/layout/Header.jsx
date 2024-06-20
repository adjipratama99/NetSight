'use client'

import { cn } from '@/lib/utils'
import Toolbar from '../customs/toolbar'
import Title from '../customs/title'
import { useSession } from 'next-auth/react'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { FaExclamationCircle, FaFileAlt, FaHome } from 'react-icons/fa'
import { usePathname } from 'next/navigation'

export default function Header({ width, className, ...props }) {
    const { data: session } = useSession()
    const pathname = usePathname()

    return (
        <header className={cn(
                className
            )}
        >
            <Toolbar className={cn('flex justify-between items-center px-4 py-2 sticky')}>
                <Link
                    href="/"
                ><Title variant="danger" size="sm" /></Link>
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className={
                            cn(
                                "rounded-lg flex items-center gap-2",
                                pathname === "/dashboard" ? "text-green-600" : "hover:text-green-500"
                            )
                        }
                    >
                        <FaHome /> Dashboard
                    </Link>
                    <Link
                        href="/alerts"
                        className={
                            cn(
                                "rounded-lg flex items-center gap-2",
                                pathname === "/alerts" ? "text-green-500" : "hover:text-green-500"
                            )
                        }
                    >
                        <FaExclamationCircle /> Alert
                    </Link>
                    <Link
                        href="/reports"
                        className={
                            cn(
                                "rounded-lg flex items-center gap-2",
                                pathname === "/reports" ? "text-green-500" : "hover:text-green-500"
                            )
                        }
                    >
                        <FaFileAlt /> Report
                    </Link>
                </div>
                <UserAvatar />
            </Toolbar>
        </header>
    )
}