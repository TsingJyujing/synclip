import React from "react";
import { Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Counter } from "util/Utils";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
export const LocalClipboardHistory = () => {
    const [cacheId, setCacheId] = React.useState(0);
    return <List key={`list-v-${cacheId}`}>
        <ListItem>
            <ListItemText>
                Clipboard History
            </ListItemText>
        </ListItem>
        {
            Array.from(Counter(window.localStorage.length)).map(i => window.localStorage.key(i)).map(k => {
                if (k !== null) {
                    const v = window.localStorage.getItem(k);
                    return <ListItem>
                        <Link href={`/clipboard/${k}`} target="_blank">
                            <ListItemText
                                primary={v}
                                secondary={k}
                            />
                        </Link>
                    </ListItem>
                }
            })
        }
        <ListItem>

            <ListItemButton onClick={() => {
                window.localStorage.clear();
                setCacheId(cacheId + 1);
            }}>
                <ListItemIcon><DeleteSweepIcon /></ListItemIcon>
                Clean History
            </ListItemButton>
        </ListItem>

    </List>
}