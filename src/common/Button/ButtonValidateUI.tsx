import { Box, Button, CircularProgress } from "@mui/material"

interface ButtonUIProps {
    text: string;
    isLoading: boolean
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const ButtonValidateUI: React.FC<ButtonUIProps> = ({text, isLoading, onClick, disabled, className, style}) => {

    return(
        <Button
        disabled={!disabled || isLoading}
        variant="contained"
        onClick={onClick}
        className={`${className ? className || '' : ''} `} 
        sx={{
            backgroundColor:'PRIMARY',
            opacity: (!disabled || isLoading) ? 0.5 : 1, // Reduce la opacidad cuando no está seleccionado
            '&:disabled': {
            backgroundColor: 'grey', // Cambia el color de fondo cuando está deshabilitado
            },
        }}
        style={{marginLeft:'0.5em', fontSize: '0.8em',  borderRadius: '0.7em', width: '82px', textTransform: 'none', color:'#fff', backgroundColor: '#222f4e', ...(style || {})}}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(isLoading) && (
                    <CircularProgress 
                        size={24} 
                        sx={{ color: 'white', position: 'absolute' }}
                    />
                )}
                <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>{text}</span>
            </Box>
        </Button>
    )
}

export default ButtonValidateUI;