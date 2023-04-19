import { Button, Container, Tab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from "@mui/system";
import { DefaultTheme } from "../../theme/DefaultTheme";
import TabsControl from '../Tabs/Tabs';

const theme = createTheme(DefaultTheme);

export default function App()
{
    return(
    <>
        <ThemeProvider theme={theme}>
            <Box 
                bgcolor={theme.palette.background.default} 
                width={'100%'} 
                height={'100vh'}
                position='absolute'
            >
                <Container maxWidth={'xl'}>
                    <Box 
                        width={'100%'}  
                        height={'100vh'}
                        position={'relative'}
                        display={'flex'}
                        alignSelf={'center'} 
                        bgcolor={theme.palette.primary.main} 
                    >
                        <TabsControl/>
                    </Box> 
                </Container>
            </Box>
        </ThemeProvider>
    </>
    );
};