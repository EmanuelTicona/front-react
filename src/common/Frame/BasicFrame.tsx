
interface BasicFrameProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    isCentered?: boolean;
    children: React.ReactNode;
}
  
  export const BasicFrame: React.FC<BasicFrameProps> = ({ id, className, style, isCentered=true ,children }) => {

    return (
      <div id={`${id}`}  className={`flex ${isCentered ? 'items-center justify-center' : ''} ${className ? className || '' : ''}`} style={style}>
        {children}
      </div>
    );
  };