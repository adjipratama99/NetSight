import { createContext, useContext, useReducer } from 'react'
import { THEME_DARK, THEME_LIGHT } from './actions'

const initialState = { theme: 'dark' }

export const ThemeContext = createContext(initialState)
export const ThemeDispatchContext = createContext(initialState)

export const ThemeProvider = ({ children }) => {
    const [theme, dispatch] = useReducer(
        themeReducer,
        initialState
    )

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeDispatchContext.Provider value={dispatch}>
                {children}
            </ThemeDispatchContext.Provider>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeContext)
}

export const useThemeDispatch = () => {
    return useContext(ThemeDispatchContext)
}

function themeReducer(state, action) {
    switch (action?.type) {
        case THEME_DARK: {
            return { theme: '.dark' }
        }
        case THEME_LIGHT: {
            return { theme: ''}
        }
        default: {
            throw Error(`Unknow action: ${action?.type}`)
        }
    }
}