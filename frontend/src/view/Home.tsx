import React from "react";
import Typography from '@mui/material/Typography';
import { Helmet } from "react-helmet";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import i18n from 'i18n';
import CreateClipboardButton from "component/CreateClipboardButton";


export default function Home() {
    const { t } = i18n;
    const isFirefox = navigator.userAgent.indexOf("Firefox") >= 0;
    return (
        <Box sx={{ width: '100%' }}>
            <Helmet><title>Synclip</title></Helmet>
            <Grid container spacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                    <Typography variant="h2">{t("welcome to use synclip")}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <CreateClipboardButton />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">{t("synclip introduction")}</Typography>
                    
                </Grid>
                <Grid item xs={12}>
                {
                        (isFirefox ? <Typography variant="h6" color={"yellow"}>{t("Firefox notify")}</Typography> : undefined)
                    }
                </Grid>

            </Grid>
        </Box>
    )
}
