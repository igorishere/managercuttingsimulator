import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import SandboxArea from "../SandboxArea/SandboxArea";
import TabContent from './TabContent';
import FileReadingArea from "../SandboxArea/FileReadingArea/FileReadingArea";

export default function TabsControl() {
    var [indexSelectedTab, setIndexSelectedTab] = useState(1);

    return (
        <>
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
            <TabContent index={0} currentIndex={indexSelectedTab} children={<FileReadingArea />} />
            <TabContent index={1} currentIndex={indexSelectedTab} children={<SandboxArea />}/>
        </>
    );
};