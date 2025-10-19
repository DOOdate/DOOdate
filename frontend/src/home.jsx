import React from "react";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

function Home(){
    const [classFilter, setClassFilter] = React.useState('All Classes');
    let classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
    return (
        <Box
        sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            bgcolor: 'background.default',
            color: 'text.primary',
        }}
        >
            <Box sx={{ marginTop: 2, justifyContent: 'center'}}>
                <Select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                >
                    <MenuItem value='All Classes'>All Classes</MenuItem>
                    {classes.map((className) => (
                        <MenuItem value={className}>{className}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar readOnly />
                </LocalizationProvider>
            </Box>
        </Box>
    )
}
export default Home