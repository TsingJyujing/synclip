import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { AlertColor, Grid, LinearProgress, TextField } from '@mui/material';
import V1Api, { Clipboard } from 'http/V1Api';
import { AlertSnackbar } from './Alert';
import { LoadingButton } from '@mui/lab';
import i18n from 'i18n';
import EditIcon from '@mui/icons-material/Edit';
import { Typography } from '@material-ui/core';

type RenameClipboardProps = {
    clipId: string;
};


export default function RenameClipboard({ clipId }: RenameClipboardProps) {
    const { t } = i18n;
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [alertText, setAlertText] = useState("");
    const [value, setValue] = React.useState("");
    const [cacheId, setCacheId] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const { isLoading, isError, data, error } = useQuery<Clipboard>(
        [clipId, cacheId],
        V1Api.getInstance().getClipboard(clipId)
    );

    const modifyNickNameMutation = useMutation(
        V1Api.getInstance().setClipBoardNickName(clipId),
        {
            onSuccess: (data) => {
                setSeverity("info");
                setAlertText(t("name modified successfully") + data.nickName);
                setOpenAlert(true);
                setOpen(false);
                setCacheId(cacheId + 1);
                modifyNickNameMutation.reset();
            },
            onError: (error) => {
                setSeverity("error");
                setAlertText(`${t("failed to modify name")} ${error}`);
                setOpenAlert(true);
                setOpen(false);
                modifyNickNameMutation.reset();
            }
        }
    );
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    if (value === "" && data !== undefined && data.nickName !== "") {
        setValue(data.nickName);
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                {isLoading ? <LinearProgress /> : <Typography variant='h3'>{data?.nickName || "No Name"}</Typography>}
            </Grid>
            <Grid item xs={4}>
                <Button variant="contained" onClick={handleClickOpen} endIcon={<EditIcon />}>
                    {t("modify nickname")}
                </Button>
                <Dialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle>
                        {t("modify nickname")}
                    </DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            id="outlined-multiline-flexible"
                            label={t("nickname")}
                            multiline
                            value={value}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton
                            onClick={() => modifyNickNameMutation.mutate(value)}
                            loading={modifyNickNameMutation.isLoading}
                            loadingPosition="end"
                            variant="contained"
                        >
                            {t("save")}
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
                <AlertSnackbar open={openAlert} setOpen={setOpenAlert} severity={severity}>{alertText}</AlertSnackbar>
            </Grid>
        </Grid>
    );
}
