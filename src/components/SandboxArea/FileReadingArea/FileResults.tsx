import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, Button, Paper, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const items = [1, 2, 3, 4];


const accordionDetail = (content: string) =>
(
    <AccordionDetails>
            <Button fullWidth 
            style={{display:'flex', flexDirection: 'row', justifyContent:'start'}}>
            <Typography color="default" textTransform='capitalize'  variant='subtitle1'>{content}</Typography>

            </Button>
            
    </AccordionDetails>
);

export default function FileResults() {
    return (
        <Paper style={{ padding: '20px', height:'450px', overflow:'auto' }}>
            <Box style={{ marginBottom: '20px' }}>
                <Typography color="primary" variant='subtitle1'>
                    Details
                </Typography>
                <Typography variant='caption' color="default">
                    File: name_of_file.txt
                </Typography>
            </Box>

            {items.map((element, index) => (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color="primary">#{index + 1}</Typography>
                        <Typography marginLeft='10px'color="primary">Material {index + 1}</Typography>
                    </AccordionSummary>
                    {accordionDetail("Chapa 1")}      
                    {accordionDetail("Chapa 2")}      
                    {accordionDetail("Chapa 3")}      
                </Accordion>
            ))}
        </Paper>
    )
}