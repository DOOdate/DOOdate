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
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import 'dayjs/locale/fr'
import i18next from "i18next";

function Home(){
    const { t } = useTranslation();
    const [classFilter, setClassFilter] = React.useState(t('All Classes'));
    let classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']; // not translated bc they will come from db, which will have the values in the user's language from the syllabus
    let assignments = [
        { title: 'Assignment 1', className: 'PHY1331', date: 'September 19th 11:59pm', weight: '4%', colour: '#dd7777' }, // not translated bc they will come from db
        { title: 'Project Proposal', className: 'HIS1101', date: 'September 22nd 5:00pm', weight: '10%', colour: '#77dd77' }, // not translated bc they will come from db
        { title: 'Lab Report', className: 'CHM1311', date: 'September 25th 11:59pm', weight: '6%', colour: '#7777dd' }, // not translated bc they will come from db
    ];
    return (
        <Box
        sx={{
            display: 'flex',
            width: '100%',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            bgcolor: 'background.default',
            color: 'text.primary',
            overflow: 'hidden'
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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18next.language}>
                    <DateCalendar readOnly showDaysOutsideCurrentMonth/>
                </LocalizationProvider>
            </Box>
            <Typography variant="h5" sx={{ alignSelf: 'flex-start', pl: 2, textAlign: 'left' }}>{t('Upcoming')}</Typography>
            <Box sx={{ flex: 1,
                overflowY: 'auto',
                width: '100%',
                maxHeight: '40vh',
                pb: '72px',
                px: 2,
                bgcolor: 'primary.secondary' }}>
                {assignments.map((assignment) => (
                    <EventCard key={assignment.title} {...assignment} />
                ))}
            </Box>
        </Box>
    )
}
export default Home