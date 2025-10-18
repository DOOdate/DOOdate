import React from "react";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';

function Settings(){
    return (
        <Box
        sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
        }}
        >
            <Typography variant="h1">DooDate</Typography>
        </Box>
    )
}
export default Settings