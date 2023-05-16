import { AppBar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DefaultTheme } from "../../theme/DefaultTheme";
import TabsControl from '../Tabs/Tabs';
import './App.css';

const theme = createTheme(DefaultTheme);

export default function App() {
    return ( 
        <div id='appWrapper'>  
            <ThemeProvider theme={theme}>
                <AppBar position='relative'>
                    <Typography
                        variant='h5'
                        sx={{ padding: '5px', marginLeft: '10px' }}>Manager cutting simulator</Typography>
                </AppBar>
                <TabsControl />
            </ThemeProvider>
        </div> 
    );
};