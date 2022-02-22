import React from "react";
import { Button, Grid, MenuItem, Select } from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";

type PaginatorWithComboProps = {
    pageId: number;
    setPageId: CallableFunction
    pageCount: number;
};


function* Counter(n: number) {
    for (let i = 0; i < n; i++) {
        yield i
    }
}

export function PaginatorWithCombo({ pageId, setPageId, pageCount }: PaginatorWithComboProps) {
    const handleChangePageId = (event: SelectChangeEvent<number>) => {
        setPageId(event.target.value);
    };
    const handlePreviousPage = () => {
        if (pageId > 1) {
            setPageId(pageId - 1)
        }
    };
    const handleNextPage = () => {
        if (pageId < pageCount) {
            setPageId(pageId + 1);
        }
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Button
                    variant="contained"
                    disabled={pageId <= 1}
                    fullWidth
                    onClick={handlePreviousPage}
                    size="large"
                    color="primary"
                >
                    <NavigateBeforeIcon />
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Select
                    id="select-page-id"
                    value={pageId}
                    variant="standard"
                    onChange={handleChangePageId}
                    fullWidth
                >
                    {
                        Array.from(Counter(pageCount)).map(
                            i => {
                                const text = `${i + 1} / ${pageCount}`;
                                return <MenuItem value={i + 1} key={text}>{text}</MenuItem>
                            }
                        )
                    }
                </Select>
            </Grid>
            <Grid item xs={4}>
                <Button
                    variant="contained"
                    disabled={pageId >= pageCount}
                    fullWidth
                    size="large"
                    color="primary"
                    onClick={handleNextPage}
                >
                    <NavigateNextIcon />
                </Button>
            </Grid>
        </Grid>
    )
}
