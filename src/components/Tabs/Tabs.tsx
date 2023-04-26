import Box from "@mui/material/Box";
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import SandboxArea from "../SandboxArea/SandboxArea";
import TabContent from './TabContent'; 

export default function TabsControl()
{ 
    var [indexSelectedTab,setIndexSelectedTab] = useState(1);
 
    return(
        <Box width={'100%;'}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    centered 
                    onChange={ (event,value) => {setIndexSelectedTab(value)} }
                >
                    <Tab sx={{textTransform: 'none'}} label="File reading" />
                    <Tab sx={{textTransform: 'none'}} label="Sandbox area" />
                </Tabs>
            </Box>
            <TabContent index={0} currentIndex={indexSelectedTab}>
                File reading area   
            </TabContent>
            <TabContent index={1} currentIndex={indexSelectedTab}> 
                    <SandboxArea/> 
            </TabContent> 
      </Box>
    );
};