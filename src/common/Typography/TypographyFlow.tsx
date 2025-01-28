import { Typography } from "@mui/material";

interface TypographyFlowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}


const TypographyFlow: React.FC<TypographyFlowProps> = ({children, style}) => {
    return (
        <Typography style={{fontSize: '0.7em', 
        maxWidth: '250px', // Ajusta según tus necesidades
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
        , ...(style || {})
      }}>{children}</Typography>
    );
}

export default TypographyFlow;