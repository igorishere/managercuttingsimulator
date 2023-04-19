import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DefaultTheme } from "../../theme/DefaultTheme";
 
const theme = createTheme(DefaultTheme);
export default function BoardsList(){ 
    const arrayLength = 30;
    const array = new Array(arrayLength).fill(0).map((_, index) => index);
    return(
        <>
            <ThemeProvider theme={theme}> 
                <List
                subheader={<ListSubheader>Boards</ListSubheader>}
                sx={{
                    maxHeight:'300px',
                    overflow: 'auto'
                }}>
                    {array.map((item,_) => 
                    (
                        <ListItemButton>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary={`Board - ${item}`}
                                secondary={`Material - WidthxHeightxDepth`}/>
                        </ListItemButton>
                    ))}
                </List>
            </ThemeProvider>
        </>
    );
}