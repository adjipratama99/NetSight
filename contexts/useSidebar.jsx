import { createContext, useContext, useReducer } from 'react'
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from './actions'

const initialState = { isOpen: true }

export const SidebarContext = createContext(initialState)
export const SidebarDispatchContext = createContext(initialState)

export const SidebarProvider = ({ children }) => {
    const [sidebar, dispatch] = useReducer(
        sidebarReducer,
        initialState
    )

    return (
        <SidebarContext.Provider value={sidebar}>
            <SidebarDispatchContext.Provider value={dispatch}>
                {children}
            </SidebarDispatchContext.Provider>
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    return useContext(SidebarContext)
}

export const useSidebarDispatch = () => {
    return useContext(SidebarDispatchContext)
}

function sidebarReducer(state, action) {
    console.log(action)
    switch (action?.type) {
        case SIDEBAR_OPEN: {
            return {
                isOpen: true,
                width: 200
            }
        }
        case SIDEBAR_CLOSE: {
            return {
                isOpen: false,
                width: 100
            }
        }
        default: {
            throw Error(`Unknow action: ${action?.type}`)
        }
    }
}