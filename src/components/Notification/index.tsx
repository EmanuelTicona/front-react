import React from 'react';
import { Alert, AlertColor, Snackbar, Typography } from '@mui/material';

type NotificationProps = {
  open: boolean,
  msg: string,
  color: string,
  severity: AlertColor | undefined,	
  handleClose: () => void,
};

const Notification: React.FC<NotificationProps> = ({open, color, msg, severity, handleClose}) => {
      return (
          <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "center"}}
          autoHideDuration={3000}
          open={open}
          onClose={handleClose}
          >
              <Alert style={{background:color}} onClose={handleClose} severity={severity}>
                  <Typography>{msg}</Typography>
              </Alert>
          </Snackbar>);
};

export default Notification;