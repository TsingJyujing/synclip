import React from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


type AlertSnackbarProps = {
    open: boolean;
    setOpen: CallableFunction;
    children: string;
    severity?: AlertColor;
};

export const AlertSnackbar = ({ open, setOpen, children, severity = "error" }: AlertSnackbarProps) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {children}
            </Alert>
        </Snackbar>
    );
}