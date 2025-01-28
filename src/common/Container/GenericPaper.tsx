import { Paper } from "@mui/material";

interface GenericPaperProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const GenericPaper: React.FC<GenericPaperProps> = ({className, style, children}) => {
    return(
        <Paper 
            className={`${className ? className || '' : ''}`}
            sx={{ padding: '1.5em', 
                border: '1px solid rgba(208,219,240,1)', 
                borderRadius: '0.5em', 
                width: '100%',
                ...(style || {}),
                }}>  
            {children}
        </Paper>
    );
}

export default GenericPaper;