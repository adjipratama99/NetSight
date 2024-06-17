'use client'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import Toolbar from '../customs/toolbar'
import { BsList as IconBars } from 'react-icons/bs'
import { useSidebar, useSidebarDispatch } from '@/contexts/useSidebar'
import Link from 'next/link'
import Title from '../customs/title'
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from '@/contexts/actions'

export default function Header({ width, className, ...props }) {
    const dispatch = useSidebarDispatch()
    const sidebar = useSidebar()

    const handleClickToggleSidebar = () => {
        dispatch({
            type: sidebar.isOpen
                    ? SIDEBAR_CLOSE
                    : SIDEBAR_OPEN
        })
    }

    return (
        <header className={cn(
                "md:hidden",
                "fixed left-0 top-0 right-0 bg-background/90 backdrop-blur-md z-50 border-b-[1px]",
                className
            )}
        >
            <Toolbar className={cn('px-8')}>
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClickToggleSidebar}
                    >
                        <IconBars size={20} />
                    </Button>

                    <Link href="/" passHref>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3"
                        >
                            <Title size="xs" />
                        </Button>
                    </Link>
                </div>

            </Toolbar>
        </header>
    )
}