import React from "react";
import Typography from '@mui/material/Typography';
import { Helmet } from "react-helmet";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import i18n from 'i18n';
import CreateClipboardButton from "component/CreateClipboardButton";


export default function Home() {
    const { t } = i18n;
    return (
        <Box sx={{ width: '100%' }}>
            <Helmet><title>Synclip</title></Helmet>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                    <Typography variant="h2">{t("welcome to use synclip")}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <CreateClipboardButton />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">{t("synclip introduction")}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}
