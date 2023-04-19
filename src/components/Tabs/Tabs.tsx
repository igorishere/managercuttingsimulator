import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import SandboxArea from "../SandboxArea/SandboxArea"; 

interface TabContentProps{
    index: number,
    currentIndex: number,
    children?: React.ReactNode
};
function TabContent(props: TabContentProps){
    return(
        <>
            <div hidden={ props.index !== props.currentIndex }>
                {props.children}
            </div>
        </>
    );
}

export default function TabsControl()
{ 
    var [indexSelectedTab,setIndexSelectedTab] = useState(1);
 
    return(
        <Box width={'100%;'}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    centered onChange={ (event,value) => {setIndexSelectedTab(value)} }>
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