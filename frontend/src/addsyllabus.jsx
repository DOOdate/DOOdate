import React from "react";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

function AddSyllabus(){
    const { t } = useTranslation();
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
            minHeight: '100vh'
        }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ 
                    borderRadius: 15, 
                    bgcolor: 'primary.secondary', 
                    width: '7vh', 
                    height: '7vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography variant="h2">+</Typography>
                </Box>
                <Typography variant="h6">{t('Upload')}</Typography>
            </Box>
        </Box>
    )
}
export default AddSyllabus