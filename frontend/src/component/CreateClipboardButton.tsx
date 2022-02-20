import React from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import i18n from 'i18n';
import { useMutation } from "react-query";
import V1Api from "http/V1Api";
import LoadingButton from '@mui/lab/LoadingButton';
import { AlertSnackbar } from "component/Alert";


export default function CreateClipboardButton() {
    const { t } = i18n;
    const [notifyFailed, setNotifyFailed] = React.useState(false);
    const [clipboardName, setClipboardName] = React.useState("Laplace");

    const createClipBoardMutation = useMutation(V1Api.getInstance().createClipBoard, {
        onSuccess: (data) => {
            window.location.pathname = `/clipboard/${data.id}`;
        },
        onError: () => {
            setNotifyFailed(true);
            createClipBoardMutation.reset();
        }
    });

    return (
        <Box sx={{ width: '100%' }}>
            <LoadingButton
                onClick={() => createClipBoardMutation.mutate()}
                endIcon={<AddIcon />}
                loading={createClipBoardMutation.isLoading}
                loadingPosition="end"
                variant="contained"
            >
                {t('create new clipboard')}
            </LoadingButton>
            <AlertSnackbar open={notifyFailed} setOpen={setNotifyFailed}>{t("failed to create clipboard")}</AlertSnackbar>
        </Box>
    )
}
