import React from "react";

interface GenericFrameProps {
    id?: string;
    className?: string;
    isCentered?: boolean;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }
  
  export const GenericFrame: React.FC<GenericFrameProps> = ({ id, className, isCentered=true, style, children }) => {
    return (
      <div id={`${id}`} className={`pt-16 pb-9 min-h-screen w-full flex ${isCentered ? 'items-center justify-center' : ''} ${className ? className || '' : ''}`} style={style}>
        {children}
      </div>
    );
  };