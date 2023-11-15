import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from "react";
import { Grid, Paper, Stack } from "@mui/material";
import Chip from '@mui/material/Chip';
import FileResults from "./FileResults";

export default function FileReadingArea() {

    var [isLoading, setIsLoading] = useState(false);
    var [loaded, setLoaded] = useState(false);

    const loadFile = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false)
            setLoaded(true);
        }, 5000);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            padding: '20px',
            background: '#E7E7E7',
            height: '100vh'
        }}>
            {
                loaded
                    ?
                    (
                        <Grid
                            container
                            spacing={4}
                        >
                            <Grid item xs={8}>
                                <Paper id='cuttingPlanWrapper'>
                                    <Stack id="cuttingPlanStatusBar" direction="row" spacing={1}>
                                        <Chip label={`Cuts: `} color="primary" />
                                        <Chip label={`Turns: `} color="primary" />
                                        <Chip label={`Parts: `} color="primary" />
                                    </Stack>
                                    <div id="cuttingPlanCanvasWrapper"
                                    // ref={cuttingPlanCanvasWrapperReference}
                                    >
                                        {/* <Canvas elements={elementsToDraw} /> */}
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={4} children={<FileResults />} />
                        </Grid>
                    )
                    :
                    isLoading
                        ?
                        (
                            <>
                                <Typography variant={"h5"}>Reading file, wait...</Typography>
                                <CircularProgress color="secondary" />
                            </>
                        )
                        :
                        (
                            <>
                                <Typography variant={"h5"}>Choose a file</Typography>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={(e) => loadFile()}
                                >
                                    Upload file
                                </Button>
                            </>
                        )

            }

        </Box>
    )
}