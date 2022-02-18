import React from "react";
import i18n from 'i18n';
import {useParams} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Clipboard() {
    const { t } = i18n;
    const {clipId} = useParams<{ clipId: string }>();
    return <Typography variant="h2">{clipId}</Typography>
}