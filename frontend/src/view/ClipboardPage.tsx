import React, { useState } from "react";
import i18n from 'i18n';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { useMutation, useQuery } from "react-query";
import V1Api, { ClipItem, ListClipItems } from "http/V1Api";
import { AlertColor, Box, IconButton, LinearProgress } from "@mui/material";
import { Alert, AlertSnackbar } from "component/Alert";
import { PaginatorWithCombo } from "component/Paginator";

import ListItemAvatar from '@mui/material/ListItemAvatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import clipboard from 'clipboardy';

import CreateClipboardItemButton from "component/CreateClipboardItemButton";
import { Helmet } from "react-helmet";
import EditClipboard from "component/EditClipboard";

type ClipItemBoxProp = {
    clipId: string;
    item: ClipItem;
    reloadList: CallableFunction;
    deleteAfterConfirmation: boolean;
};

function ClipItemBox({ clipId, item, reloadList, deleteAfterConfirmation }: ClipItemBoxProp) {
    const { t } = i18n;
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [alertText, setAlertText] = useState("");

    const deleteItemMutation = useMutation(
        V1Api.getInstance().deleteClipboardItem(clipId, item.id),
        {
            onSuccess: () => {
                reloadList();
            },
            onError: (error) => {
                deleteItemMutation.reset();
                setSeverity("error");
                setAlertText(t("failed to delete item") + JSON.stringify(error));
                setOpen(true);
            }
        }
    );

    const getContentMutation = useMutation(
        V1Api.getInstance().getClipboardItemContent(clipId, item.id),
        {
            onSuccess: (data) => clipboard.write(data).then(
                () => {
                    setSeverity("info");
                    setAlertText(t("copied to clipboard") + item.preview);
                    setOpen(true);
                }
            ),
            onError: () => {
                getContentMutation.reset();
                setSeverity("error");
                setAlertText(t("failed to fetch items"));
                setOpen(true);
            }
        }
    );

    return <ListItem
        secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => {
                if (!deleteAfterConfirmation || window.confirm(`${t("delete item")} ${item.preview}`)) {
                    deleteItemMutation.mutate()
                }
            }}>
                <DeleteIcon color="error" />
            </IconButton>
        }
    >
        <ListItemAvatar >
            <ListItemButton onClick={() => getContentMutation.mutate()}>
                <Avatar>
                    <ContentCopyIcon color="success" />
                </Avatar>
            </ListItemButton>
        </ListItemAvatar>


        <ListItemButton onClick={() => getContentMutation.mutate()} >
            <ListItemText
                primary={item.preview}
                secondary={item.created}//TODO using format like several minutes ago/few days ago...
            />
        </ListItemButton>

        <AlertSnackbar
            open={open}
            setOpen={setOpen}
            severity={severity}
        >
            {alertText}
        </AlertSnackbar>

    </ListItem>
}

type ClipItemsListProps = {
    clipId: string;
    deleteAfterConfirmation: boolean;
    cacheId: number;
    reloadList: CallableFunction;
};

function ClipItemsList({ clipId, deleteAfterConfirmation, cacheId, reloadList }: ClipItemsListProps) {
    const { t } = i18n;
    const [pageId, setPageId] = useState(1);
    const pageSize = 50;
    const { isLoading, isError, data, error } = useQuery<ListClipItems>(
        [clipId, pageId, pageSize, cacheId],
        V1Api.getInstance().getClipboardItems(clipId, pageId, pageSize)
    );
    if (isLoading) {
        return <LinearProgress />;
    }
    if (isError || data === undefined) {
        console.error(`Error while fetching clip items: ${error}`);
        return <Alert severity={"error"} sx={{ width: '100%' }} >{t("failed to fetch items")}</Alert>;
    }
    const pageCount = Math.max(data.totalPages, 1);
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <List>
                    {data.content.map((item) => (
                        <ClipItemBox
                            clipId={clipId}
                            item={item}
                            reloadList={reloadList}
                            deleteAfterConfirmation={deleteAfterConfirmation}
                            key={`${clipId}/${item.id}`}
                        />
                    ))}
                </List>
            </Grid>
            <Grid item xs={12}>
                <PaginatorWithCombo pageId={pageId} setPageId={setPageId} pageCount={pageCount}></PaginatorWithCombo>
            </Grid>
        </Grid>
    );
}

export default function ClipboardPage() {
    const { clipId } = useParams<{ clipId: string }>();
    const [cacheId, setCacheId] = useState(1);
    const disableCache = () => { setCacheId(cacheId + 1) };
    const [deleteAfterConfirmation, setDeleteAfterConfirmation] = useState(true);
    const [createByShortcut, _setCreateByShortcut] = useState(true);
    const createByShortcutRef = React.useRef(createByShortcut);
    const setCreateByShortcut = (value: boolean) => {
        createByShortcutRef.current = value;
        _setCreateByShortcut(value);
    }
    if (clipId === undefined) {
        return <Alert severity={"error"} sx={{ width: '100%' }} />;
    }
    return <Grid container spacing={1}>
        <Helmet><title>Synclip</title></Helmet>
        <Grid item xs={12}>
            <EditClipboard
                clipId={clipId}
                setCreateByShortcut={setCreateByShortcut}
                setDeleteAfterConfirmation={setDeleteAfterConfirmation}
            />
        </Grid>
        <Grid item xs={12}>
            <CreateClipboardItemButton
                key="create-clipboard-item"
                clipId={clipId}
                reloadList={disableCache}
                createByShortcutRef={createByShortcutRef}
            />
        </Grid>
        <Grid item xs={12}>
            <ClipItemsList
                clipId={clipId}
                deleteAfterConfirmation={deleteAfterConfirmation}
                cacheId={cacheId}
                reloadList={disableCache}
            />
        </Grid>
    </Grid>
}