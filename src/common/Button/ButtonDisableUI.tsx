import { Button } from "@mui/material"

interface ButtonDisableUIProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    color?: string;
    width?: string;
}

const ButtonDisableUI: React.FC<ButtonDisableUIProps> = ({text, onClick, disabled=false, className, style, color='ml-primary', width='82px'}) => {

    return(
        <Button
        disabled={disabled}
        variant="contained"
        onClick={onClick}
        className={`${className ? className || '' : ''} `} 
        sx={{
            opacity: (disabled) ? 0.5 : 1, 
            '&:disabled': {
                color: 'white',
                backgroundColor: 'grey',
            },
        }}
        style={{fontSize: '0.7em',  
            borderRadius: '0.7em', 
            width: width, 
            textTransform: 'none', 
            backgroundColor: color,
            ...(style || {})
        }}>
            {text}
        </Button>
    )
}

export default ButtonDisableUI;