import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { AlertColor, Grid, LinearProgress, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, Box } from '@mui/material';
import V1Api, { Clipboard } from 'http/V1Api';
import { Alert, AlertSnackbar } from './Alert';
import { LoadingButton } from '@mui/lab';
import i18n from 'i18n';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


type RenameClipboardProps = {
    clipId: string;
};


export default function EditClipboard({ clipId }: RenameClipboardProps) {
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

    if (isError || data === undefined) {
        console.error(`Error while fetching clipboard: ${error}`);
        return <Alert severity={"error"} sx={{ width: '100%' }} >{t("failed to fetch items")}</Alert>;
    }
    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {isLoading ? <LinearProgress /> : <Typography variant='h4'>{data?.nickName || "No Name"}</Typography>}
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                label={t("nickname")}
                                variant="standard"
                                value={value}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <LoadingButton
                                onClick={() => modifyNickNameMutation.mutate(value)}
                                loading={modifyNickNameMutation.isLoading}
                                variant="contained"
                                fullWidth
                                size="large"
                            >
                                {t("save")}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <AlertSnackbar open={openAlert} setOpen={setOpenAlert} severity={severity}>{alertText}</AlertSnackbar>
        </Box>
    );
}
