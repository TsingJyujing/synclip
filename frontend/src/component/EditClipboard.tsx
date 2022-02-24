import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { AlertColor, Grid, LinearProgress, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, Box, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import V1Api, { Clipboard } from 'http/V1Api';
import { Alert, AlertSnackbar } from './Alert';
import { LoadingButton } from '@mui/lab';
import i18n from 'i18n';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QRCode from "react-qr-code";

type RenameClipboardProps = {
    clipId: string;
    setDeleteAfterConfirmation: CallableFunction;
    setCreateByShortcut: CallableFunction;
};


export default function EditClipboard({
    clipId,
    setDeleteAfterConfirmation,
    setCreateByShortcut
}: RenameClipboardProps) {
    const { t } = i18n;
    const [expanded, setExpanded] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [openQRCode, setOpenQRCode] = React.useState(false);
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

    const modifyClipboard = useMutation(
        V1Api.getInstance().modifyClipboard(clipId),
        {
            onSuccess: (data) => {
                setSeverity("info");
                setAlertText(t("clipboard modified successfully"));
                setOpenAlert(true);
                setCacheId(cacheId + 1);
                modifyClipboard.reset();
            },
            onError: (error) => {
                setSeverity("error");
                setAlertText(`${t("failed to modify clipboard")} ${error}`);
                setOpenAlert(true);
                modifyClipboard.reset();
            }
        }
    );

    const deleteClipboard = useMutation(
        V1Api.getInstance().deleteClipboard(clipId),
        {
            onSuccess: () => {
                window.location.pathname = "/";
            },
            onError: (error) => {
                setSeverity("error");
                setAlertText(`${t("failed to delete clipboard")} ${error}`);
                setOpenAlert(true);
                modifyClipboard.reset();
            }
        }
    );

    const handleExpand = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    const handleDeleteAfterConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setDeleteAfterConfirmation(newValue);
        modifyClipboard.mutate({ deleteAfterConfirmation: newValue })
    }

    const handleCreateByShortcutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setCreateByShortcut(newValue);
        modifyClipboard.mutate({ createByShortcut: newValue })
    }

    if (value === "" && data !== undefined && data.nickName !== "") {
        setValue(data.nickName);
    }

    if (isLoading) {
        return <LinearProgress />;
    }

    if (isError || data === undefined) {
        console.error(`Error while fetching clipboard: ${error}`);
        return <Alert severity={"error"} sx={{ width: '100%' }} >{t("failed to fetch items")}</Alert>;
    }

    setDeleteAfterConfirmation(data.deleteAfterConfirmation);
    setCreateByShortcut(data.createByShortcut);

    return (
        <Box>
            <Accordion expanded={expanded} onChange={handleExpand}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {isLoading ? <LinearProgress /> : <Typography variant='h4'>{data?.nickName || t("No Name")}</Typography>}
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={10}>
                            <TextField
                                fullWidth
                                label={t("nickname")}
                                variant="standard"
                                value={value}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <LoadingButton
                                onClick={() => modifyClipboard.mutate({ nickName: value })}
                                loading={modifyClipboard.isLoading}
                                variant="contained"
                                fullWidth
                                size="large"
                            >
                                {t("save")}
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={data.deleteAfterConfirmation} onChange={handleDeleteAfterConfirmationChange} name="deleteAfterConfirmation" />
                                }
                                label={t("confirmation is requires before deleting item").toString()}
                            />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={data.createByShortcut} onChange={handleCreateByShortcutChange} name="createByShortcut" />
                                }
                                label={t("create item by shortcut directly").toString()}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Button
                                onClick={() => {
                                    setOpenQRCode(true)
                                }}
                                variant="contained"
                                fullWidth
                                size="large"
                            >
                                {t("QR Code")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <LoadingButton
                                onClick={() => {
                                    if (window.confirm(t("do you want to delete the whole clipboard?"))) {
                                        deleteClipboard.mutate()
                                    }
                                }}
                                loading={deleteClipboard.isLoading}
                                color="error"
                                variant="contained"
                                fullWidth
                                size="large"
                            >
                                {t("delete clipboard")}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <AlertSnackbar open={openAlert} setOpen={setOpenAlert} severity={severity}>{alertText}</AlertSnackbar>
            <Dialog
                onClose={() => setOpenQRCode(false)}
                aria-labelledby="customized-dialog-title"
                open={openQRCode}
            >
                <DialogTitle>
                    {t("Use App to scan this QR code")}
                </DialogTitle>
                <DialogContent dividers>
                    <QRCode value={window.location.toString()} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
