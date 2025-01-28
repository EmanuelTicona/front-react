export type ContextProps = {
    getError: (msg: string, type?: string) => void;
    getSuccess: (msg: string, type?: string) => void;
    getWarning: (msg: string, type?: string) => void;
  };