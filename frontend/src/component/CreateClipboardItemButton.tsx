import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { AlertColor, Box, TextField } from '@mui/material';
import V1Api from 'http/V1Api';
import { AlertSnackbar } from './Alert';
import { LoadingButton } from '@mui/lab';
import i18n from 'i18n';


type CreateClipboardItemButtonProps = {
    clipId: string;
    reloadList: CallableFunction;
};


export default function CreateClipboardItemButton({ clipId, reloadList }: CreateClipboardItemButtonProps) {
    const { t } = i18n;
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [alertText, setAlertText] = useState("");
    const [value, setValue] = React.useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const processPasteEvent = (ev: ClipboardEvent) => {
        const text = ev.clipboardData?.getData("text");
        if (text !== undefined) {
            if (!open){
                setValue(text);
                setOpen(true);
            }
        }
    };
    
    React.useEffect(() => {
        document.addEventListener("paste", processPasteEvent)
    }, []);

    const createItemMutation = useMutation(
        V1Api.getInstance().createClipBoardItem(clipId),
        {
            onSuccess: (data) => {
                setSeverity("info");
                setAlertText(t("create item successfully") +  data.preview);
                setOpenAlert(true);
                setOpen(false);
                reloadList();
                createItemMutation.reset();
            },
            onError: (error) => {
                setSeverity("error");
                setAlertText(`${t("failed to create item")} ${error}`);
                setOpenAlert(true);
                setOpen(false);
                createItemMutation.reset();
            }
        }
    );
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Button variant="contained" onClick={handleClickOpen}>
                {t("create clipboard item")}
            </Button>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle>
                    {t("create clipboard item")}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        id="outlined-multiline-flexible"
                        label={t("text to create")}
                        multiline
                        value={value}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        onClick={() => createItemMutation.mutate(value)}
                        loading={createItemMutation.isLoading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        {t("save")}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <AlertSnackbar open={openAlert} setOpen={setOpenAlert} severity={severity}>{alertText}</AlertSnackbar>
        </Box>
    );
}
