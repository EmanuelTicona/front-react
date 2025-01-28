import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import React from "react";

type ThemeProp = {
    children: JSX.Element
}

enum themePalette {
    BG= "#12181b",
    PRIMARY= "#244754",
    WHITE= "#FFFFFF",
    FRONT_GLOBAL=  "'Open Sans'",
    //Aler styles
    ERROR_MAIN= "#F44336",
    BG_ERROR_MAIN= "rgba(244, 67, 54, 0.1)",
    SUCCESS_MAIN= "#4CAF50",
    BG_SUCCESS_MAIN= "rgba(76, 175, 80, 0.1)",
    WARNING_MAIN= "#FF9800",
    BG_WARNING_MAIN= "rgba(255, 152, 0, 0.1)",
}

const theme = createTheme({
    palette: {
       /*  mode: "dark", */
        background: {
            default: themePalette.WHITE,
        },
        primary: {
            main: themePalette.PRIMARY,
        },
    },
    typography: {
        fontFamily: themePalette.FRONT_GLOBAL,
        fontSize: 16,
    },
    components: {
        MuiRating: {
            styleOverrides: {
              iconEmpty: {
                color: '#fff',
              },
            },
          },
        MuiButton: {
            defaultProps: {
                style: {
                    backgroundColor: themePalette.PRIMARY,
                    textTransform: "none",
                    boxShadow: "none",
                    borderRadius: "0.7em",
                    color: themePalette.WHITE,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
              root: {
                borderRadius: "0.7em",// Bordes redondeados para todos los TextField
                '& .MuiInputBase-input': {
                  fontSize: '1rem',  // Cambia el tamaño de la fuente del texto ingresado
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',  // Tamaño de la fuente del label
                },
              },
            },
        },
        MuiToolbar: {
            defaultProps: {
                style: {
                    backgroundColor: themePalette.PRIMARY,
                    color: themePalette.WHITE,
                },
            },
            styleOverrides: {
                root: {
                    color: themePalette.PRIMARY,
                },
              },
        },
        MuiSelect: {
            styleOverrides: {
              select: {
                '&:focus': {
                  border: 0,
                },
              },
            },
          },
        MuiAlert:{
            defaultProps: {
                style: {
                    borderRadius: "0.8em",
                    fontSize: "1em",
                },
            },
            styleOverrides: {
                standardError: {
                    border: `1px solid ${themePalette.ERROR_MAIN}`,
                    backgroundColor: themePalette.BG_ERROR_MAIN,
                },
                standardSuccess: {
                    border: `1px solid ${themePalette.SUCCESS_MAIN}`,
                    backgroundColor: themePalette.BG_SUCCESS_MAIN,
                },
                standardWarning: {
                    border: `1px solid ${themePalette.WARNING_MAIN}`,
                    backgroundColor: themePalette.BG_WARNING_MAIN,
                },
            },
        },
    },

});

export const ThemeConfig: React.FC<ThemeProp> = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
};