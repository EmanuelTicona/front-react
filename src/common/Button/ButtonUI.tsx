import { Box, Button, CircularProgress } from "@mui/material"

interface ButtonUIProps {
    text: string;
    isLoading: boolean
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    size?: number;
}

const ButtonUI: React.FC<ButtonUIProps> = ({text, isLoading, onClick, className, style, size=24}) => {

    return(
        <Button
            className={`${className ? className || '' : ''} `} 
            sx={{ backgroundColor:'PRIMARY', borderColor: 'white', mt:1.5, mb:1, }}
            style={{ ...(style || {}) }}
            onClick={onClick}
            type="submit" 
            variant="contained" 
            disabled={isLoading}
        >
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isLoading && (
                    <CircularProgress 
                        size={size} 
                        sx={{ color: 'white', position: 'absolute' }}
                    />
                )}
                <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>{text}</span>
            </Box>
        </Button>
    )
}

export default ButtonUI;