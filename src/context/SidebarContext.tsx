import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface SidebarContextType {
    mobileOpen: boolean
    collapsed: boolean
    setMobileOpen: (open: boolean) => void
    setCollapsed: (collapsed: boolean) => void
    toggleMobile: () => void
    toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextType>({
    mobileOpen: false,
    collapsed: false,
    setMobileOpen: () => {},
    setCollapsed: () => {},
    toggleMobile: () => {},
    toggleCollapsed: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => useContext(SidebarContext)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), [])
    const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), [])

    return (
        <SidebarContext.Provider value={{ mobileOpen, collapsed, setMobileOpen, setCollapsed, toggleMobile, toggleCollapsed }}>
            {children}
        </SidebarContext.Provider>
    )
}
