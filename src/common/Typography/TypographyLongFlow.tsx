interface TypographyLongFlowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}


const TypographyLongFlow: React.FC<TypographyLongFlowProps> = ({children, style}) => {
    return (
        <span style={{
        display: 'inline-block',
        maxWidth: '340px', // Ajusta según tus necesidades
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
        , ...(style || {})
      }}>{children}</span>
    );
}

export default TypographyLongFlow;