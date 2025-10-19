import React from "react";
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import EventCard from './components/EventCard.jsx'
import { useTheme } from '@mui/material/styles';

function Home(){
    const [classFilter, setClassFilter] = React.useState('All Classes');
    let classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
    let assignments = [
        { title: 'Assignment 1', className: 'Physics', date: 'September 19th 11:59pm', weight: '4%', colour: '#dd7777' },
        { title: 'Project Proposal', className: 'History', date: 'September 22nd 5:00pm', weight: '10%', colour: '#77dd77' },
        { title: 'Lab Report', className: 'Chemistry', date: 'September 25th 11:59pm', weight: '6%', colour: '#7777dd' },
    ];
    const theme = useTheme();
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
            <Box sx={(theme) => ({
                p: 2,
                borderRadius: 1,
                transition: 'background-color 200ms',
            })}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar readOnly showDaysOutsideCurrentMonth/>
                </LocalizationProvider>
            </Box>
            <Typography variant="h5" sx={{ alignSelf: 'flex-start', pl: 2, textAlign: 'left' }}>Upcoming</Typography>
            <Box sx={{ width: '100%',
                 bgcolor: theme.palette.primary.light                 }}>
                {assignments.map((assignment) => (
                    <EventCard key={assignment.title} {...assignment} />
                ))}
            </Box>
        </Box>
    )
}
export default Home