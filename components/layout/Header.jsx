'use client'

import { cn } from '@/lib/utils'
import Title from '../customs/title'
import { useSession } from 'next-auth/react'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { FaExclamationCircle, FaFileAlt, FaHome } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from 'react'
import MenuList from '@/config/menu'

export default function Header({ width, className, ...props }) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className={cn(
                className
            )}
        >
            <nav className={cn('sticky bg-white border-gray-200')}>
                <div className={cn("flex flex-wrap items-center justify-between mx-auto p-3")}>
                    <Link
                        href="/"
                    ><Title variant="danger" size="sm" /></Link>
                    <div className="flex md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
                        <button 
                            data-collapse-toggle="navbar-default" 
                            type="button" 
                            className={cn(
                                "self-start inline-flex items-center p-2 w-8 h-8 justify-center text-sm",
                                "text-gray-500 rounded-lg md:hidden hover:bg-gray-100",
                                "focus:outline-none focus:ring-2 focus:ring-gray-200")} 
                            aria-controls="navbar-default" 
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(prev => !prev)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <RxHamburgerMenu />
                        </button>
                        <UserAvatar />
                    </div>
                    <div className={cn(
                        (menuOpen) ? "block" : "hidden",
                        "md:self-start md:mt-1 w-full md:block md:w-auto"
                     )}
                     id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                            {
                                MenuList().map(menu => {
                                    const randNumber = Math.floor(Math.random() * 1000)
                                    
                                    if(session?.token?.access.includes(menu?.accessKey)) {
                                        return (
                                            <li key={randNumber}>
                                                <Link
                                                    href={menu?.link}
                                                    className={
                                                        cn(
                                                            "rounded-lg flex items-center gap-2",
                                                            pathname === menu?.link ? "text-green-600" : "hover:text-green-500"
                                                        )
                                                    }
                                                >
                                                    { menu?.icon }
                                                    { menu?.label }
                                                </Link>
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}