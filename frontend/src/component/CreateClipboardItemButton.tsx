import * as React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { AlertColor, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import V1Api, { CreateItemRequest } from 'http/V1Api';
import { AlertSnackbar } from 'component/Alert';
import { LoadingButton } from '@mui/lab';
import i18n from 'i18n';


type CreateClipboardItemButtonProps = {
    clipId: string;
    reloadList: CallableFunction;
    createByShortcutRef: React.MutableRefObject<boolean>;
};

export default function CreateClipboardItemButton({ clipId, reloadList, createByShortcutRef }: CreateClipboardItemButtonProps) {
    const { t } = i18n;
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [alertText, setAlertText] = useState("");
    const [value, setValue] = React.useState<CreateItemRequest | undefined>();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (value !== undefined) {
            setValue({ ...value, content: event.target.value });
        } else {
            setValue({ mimeType: "text/plain", content: event.target.value });
        }
    };


    React.useEffect(() => {
        document.addEventListener("paste", (ev: ClipboardEvent) => {
            const text = ev.clipboardData?.getData("text/plain");
            if (text !== undefined && text !== "") {
                const requestValue: CreateItemRequest = {
                    content: text,
                    mimeType: "text/plain",
                };
                if (!open) {
                    if (createByShortcutRef.current) {
                        createItemMutation.mutate(requestValue);
                    } else {
                        setValue(requestValue);
                        setOpen(true);
                    }
                }
            } else {
                const items = ev.clipboardData?.items;
                if (items !== undefined) {
                    for (let i = 0; i < items?.length; i++) {
                        const item = items[i];
                        if (item.type.indexOf("image") !== -1) {
                            const file = item.getAsFile();
                            if (file !== null) {
                                const fileReader = new FileReader();
                                const url = fileReader.readAsDataURL(file);
                                fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
                                    const result = fileReader.result;
                                    if (typeof result === "string") {
                                        const requestValue = {
                                            mimeType: item.type,
                                            content: result
                                        };
                                        if (createByShortcutRef.current) {
                                            createItemMutation.mutate(requestValue);
                                        } else {
                                            setValue(requestValue)
                                            setOpen(true);
                                        }
                                    } else {
                                        console.error(`Get unexpected result type: ${typeof result}`)
                                    }
                                }
                                console.log("Got url: " + url)
                                break;
                            }
                        }
                    }
                }
            }
        })
    }, []);

    const createItemMutation = useMutation(
        V1Api.getInstance().createClipBoardItem(clipId),
        {
            onSuccess: (data) => {
                setSeverity("info");
                setAlertText(t("create item successfully") + data.preview);
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
                    {
                        value === undefined || value.mimeType === "text/plain" ? (<TextField
                            id="outlined-multiline-flexible"
                            label={t("text to create")}
                            multiline
                            value={value?.content}
                            onChange={handleChange}
                        />) : (
                            <img src={value.content} alt="from clipboard" />
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        onClick={() => {
                            if (value !== undefined && value.content.length > 0) {
                                createItemMutation.mutate(value)
                            }
                        }}
                        disabled={!(value !== undefined && value.content.length > 0)}
                        loading={createItemMutation.isLoading}
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
