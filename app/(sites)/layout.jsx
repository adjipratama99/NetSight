"use client"

import Title from "@/components/customs/title";
import Toolbar from "@/components/customs/toolbar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import UserAvatar from "@/components/layout/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { THEME_DARK, THEME_LIGHT } from "@/contexts/actions";
import { SidebarProvider } from "@/contexts/useSidebar";
import { ThemeProvider, useTheme, useThemeDispatch } from "@/contexts/useThemePicker";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaCog } from "react-icons/fa";

export default function SiteLayout({ children }) {
    const theme = useTheme()
    const dispatch = useThemeDispatch()
    const [displayTheme, setDisplayTheme] = useState(false)
    const changeTheme = (selected) => {
        dispatch({
            type: selected
        })
    }

    return (
        <ThemeProvider>
            <SidebarProvider>
                <div className={theme.theme}>
                    <div className="flex justify-between items-center px-4 py-2">
                        <Title size="sm" variant="danger" />
                        <UserAvatar />
                    </div>
                    <Toolbar className="md:hidden" />
                    <div className="relative">
                        <main className="px-4">
                            { children }
                        </main>
                    </div>
                    {/* <div className="absolute inset-y-[10rem] right-1">
                        <Button size="icon" variant="secondary" className="relative left-[105px] mb-1" onClick={() => setDisplayTheme(!displayTheme)}><FaCog /></Button>
                        <div 
                        className={cn('p-3 bg-slate-700 rounded-lg',
                            'border border-slate-600',
                            displayTheme ? "block animate animate-slideInRight" : "animate animate-slideOutRight"
                        )}>
                            <div className="text-sm mb-3">Theme Color:</div>
                            <div className="flex items-center gap-2">
                                <Badge 
                                variant="secondary" 
                                className={cn('cursor-pointer', theme.theme === "dark" ? 'border border-slate-300' : '')}
                                onClick={() => changeTheme(THEME_DARK)}
                                >Dark</Badge>
                                <Badge 
                                className={cn('cursor-pointer', theme.theme === "light" ? 'border border-slate-300' : '')}
                                onClick={() => changeTheme(THEME_LIGHT)}
                                >Light</Badge>
                            </div>
                        </div>
                    </div> */}
                </div>
            </SidebarProvider>
        </ThemeProvider>
    )
}