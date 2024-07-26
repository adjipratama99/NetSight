"use client"

import Toolbar from "@/components/customs/toolbar";
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/contexts/useSidebar";
import { ThemeProvider, useTheme } from "@/contexts/useThemePicker";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function SiteLayout({ children }) {
    const theme = useTheme()

    return (
        <ThemeProvider>
            <SidebarProvider>
                <div className={theme.theme}>
                    <Header />
                    <div className="relative">
                        <main className="px-4">
                            { children }
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </ThemeProvider>
    )
}