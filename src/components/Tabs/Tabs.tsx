import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import SandboxArea from "../SandboxArea/SandboxArea";
import TabContent from './TabContent';
import { Typography } from "@mui/material";
import ImagesearchRollerIcon from '@mui/icons-material/ImagesearchRoller';

export default function TabsControl() {
    var [indexSelectedTab, setIndexSelectedTab] = useState(1);

    return (
        <Box width={'100%;'}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    centered
                    value={indexSelectedTab}
                    onChange={(event, value) => { setIndexSelectedTab(value) }}
                >
                    <Tab label="File reading" />
                    <Tab label="Sandbox area" />
                </Tabs>
            </Box>
            <TabContent index={0} currentIndex={indexSelectedTab}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Typography variant={"h5"}>
                        Comming soon!
                    </Typography>
                    <ImagesearchRollerIcon fontSize="large" />
                </Box>
            </TabContent>
            <TabContent index={1} currentIndex={indexSelectedTab}>
                <SandboxArea />
            </TabContent>
        </Box>
    );
};