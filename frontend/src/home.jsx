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
import EventCard from './components/EventCard.jsx';
import dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr'
import updateLocale from 'dayjs/plugin/updateLocale'
import i18next from "i18next";
import localizedFormat from "dayjs/plugin/localizedFormat"
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Home(){
    const { t } = useTranslation();
    const [classFilter, setClassFilter] = React.useState('All Classes');
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedAssignment, setSelectedAssignment] = React.useState(null);
    const [completedIds, setCompletedIds] = React.useState(new Set());

    let assignments = [
        { id: 1, title: 'Assignment 1', className: 'Physics', date: '2025-11-19T23:59:00', weight: '4%', colour: '#dd7777', profEmail: 'physics.prof@uottawa.ca', latePolicy: [{ time: 24, penalty: 10 }, { time: 48, penalty: 25 }] },
        { id: 2, title: 'Project Proposal', className: 'History', date: '2025-12-22T17:00:00', weight: '10%', colour: '#77dd77', profEmail: 'history.prof@uottawa.ca', latePolicy: [] },
        { id: 3, title: 'Lab Report', className: 'Chemistry', date: '2025-11-25T23:59:00', weight: '6%', colour: '#7777dd', profEmail: 'chem.prof@uottawa.ca', latePolicy: [{ time: 24, penalty: 15 }] },
        { id: 4, title: 'Presentation', className: 'Calculus', date: '2025-11-25T23:59:00', weight: '10%', colour: '#e67607', profEmail: 'calc.prof@uottawa.ca', latePolicy: [] },
        { id: 5, title: 'Final Exam', className: 'Calculus', date: '2025-11-28T23:59:00', weight: '20%', colour: '#e67607', profEmail: 'calc.prof@uottawa.ca', latePolicy: [] },
        { id: 6, title: 'Exam Preperation Assignment', className: 'Calculus', date: '2025-11-28T23:59:00', weight: '0%', colour: '#e67607', profEmail: 'calc.prof@uottawa.ca', latePolicy: [] },
        { id: 7, title: 'Review Task', className: 'History', date: '2025-11-28T23:59:00', weight: '10%', colour: '#77dd77', profEmail: 'history.prof@uottawa.ca', latePolicy: [] },
        { id: 8, title: 'Problem Set 1', className: 'Chemistry', date: '2025-11-28T23:59:00', weight: '5%', colour: '#7777dd', profEmail: 'chem.prof@uottawa.ca', latePolicy: [{ time: 24, penalty: 15 }] },
    ];
    dayjs.extend(updateLocale)
    dayjs.extend(localizedFormat);
    dayjs.updateLocale('fr' ,{
        months : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', "Août", 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    })
    dayjs.locale(i18next.language)


    const classNamesSet = new Set();
    for (const a1 of assignments) {
        classNamesSet.add(a1.className);
    }
    const classNames = [...classNamesSet]

    let filteredAssignments = [];
    for (const a of assignments) {
        if (!completedIds.has(a.id) && (classFilter == 'All Classes' || a.className == classFilter)) {
            filteredAssignments.push(a);
        }
    }

    let upcomingAssignments = [];
    for (const a of filteredAssignments) {
        if (selectedDate == null) {
            upcomingAssignments.push(a);
        }
        else{
            if(dayjs(a.date).isSame(selectedDate, "day")){
                upcomingAssignments.push(a);
            }
        }
    }

    const handleMarkDone = (assignment) => {
        setCompletedIds(prev => new Set([...prev, assignment.id]));
        setDialogOpen(false);
        // TODO: In future, call API to persist completion: 
        // await axios.post(`/api/deadlines/${assignment.id}/complete/`);
    }; 

    const assignmentsPerDay = new Map();

    for (const ai of filteredAssignments) {
        const date = dayjs(ai.date);
        if (!date.isValid()){
            continue;
        }
        const key = date.format("YYYY-MM-DD");

        if (!assignmentsPerDay.has(key)){
            assignmentsPerDay.set(key, []);
            }
        assignmentsPerDay.get(key).push(ai);
        };

    const AssignmentDay = (props) => {
        const { day, outsideCurrentMonth, selected, ...other } = props;
        const key = day.format("YYYY-MM-DD");

        let todaysAssignments = assignmentsPerDay.get(key);
        if (!todaysAssignments) {
            todaysAssignments = [];
        }

        const dots = [];
        const limitedAssignments = todaysAssignments.slice(0, 2);

        for (let i = 0; i < limitedAssignments.length; i++) {
            const assignment = limitedAssignments[i];
            dots.push(
            <Box
            key={i}
                sx =
                {{
                    width: "0.43rem",
                    height: "0.43rem",
                    borderRadius: "50%",
                    bgcolor: assignment.colour
                }}
                />
            );
        }

        if(todaysAssignments.length != limitedAssignments.length){
            dots.push(
                <Box
                key="plus_dot"
                    sx =
                    {{
                        width: "0.43rem",
                        height: "0.43rem",
                        borderRadius: "50%",
                        bgcolor: 'primary.secondary',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    +
                    </Box>
            )
        }

        if (todaysAssignments.length === 0) {
            return (<Box sx={{ position: "relative", }}>
            <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth}/></Box>);
        }


        return (
            <Box sx={{ position: "relative" }}>
              <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth}/>
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: "4px",
                  display: "flex",
                  gap: "0.5px",
                }}
              > {dots}
              </Box>
            </Box>
          );
        };


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
            <Box sx={{ marginTop: 2, justifyContent: 'center',}}>
                <Select
                sx={{width: {xs: "70vw", md: "17vw"}, height: {xs: "5.5vh", md: "5vh"}}}
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                >
                    <MenuItem value='All Classes'>{t('All Classes')}</MenuItem>
                    {classNames.map((className) => (
                        <MenuItem key={className} value={className}>{className}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box sx={(theme) => ({
                p: 2,
                borderRadius: 1,
                transition: 'background-color 200ms',
            })}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18next.language}>
                    <DateCalendar
                    onChange={(newValue) =>{
                    if (selectedDate && newValue && selectedDate.isSame(newValue, "day")) {
                        setSelectedDate(null);
                    }
                    else{
                        setSelectedDate(newValue);
                    }
                    }} 
                    showDaysOutsideCurrentMonth 
                    slots={{ day: AssignmentDay }}
                    />
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
                {upcomingAssignments.map((assignment) => (
                    <EventCard 
                        key={assignment.id} 
                        {...assignment} 
                        date={dayjs(assignment.date).format("LLL")} 
                        onClick={() => {
                            setSelectedAssignment(assignment);
                            setDialogOpen(true);
                        }}
                    />
                ))}
            </Box>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {selectedAssignment?.title}
                    <IconButton
                        aria-label="close"
                        onClick={() => setDialogOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        {selectedAssignment?.className}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>{t('Due')}:</strong> {selectedAssignment && dayjs(selectedAssignment.date).format("LLL")}
                    </Typography>
                    {selectedAssignment && (() => {
                        const now = dayjs();
                        const due = dayjs(selectedAssignment.date);
                        const diff = due.diff(now);
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const isPast = diff < 0;
                        
                        if (isPast) {
                            return (
                                <Typography variant="body2" sx={{ mb: 1, color: 'error.main' }}>
                                    <strong>⚠️ Overdue</strong> by {Math.abs(days)} days {Math.abs(hours)} hours
                                </Typography>
                            );
                        }
                        return (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>⏰ Time remaining:</strong> {days} days {hours} hours
                            </Typography>
                        );
                    })()}
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>{t('Weight')}:</strong> {selectedAssignment?.weight}
                    </Typography>
                    {selectedAssignment?.profEmail && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>📧 Professor:</strong>{' '}
                            <a href={`mailto:${selectedAssignment.profEmail}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                                {selectedAssignment.profEmail}
                            </a>
                        </Typography>
                    )}
                    {selectedAssignment?.latePolicy && selectedAssignment.latePolicy.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>📋 Late Policy:</strong>
                            </Typography>
                            {selectedAssignment.latePolicy.map((policy, idx) => (
                                <Typography key={idx} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                    • {policy.time}h late: -{policy.penalty}% penalty
                                </Typography>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>{t('Close')}</Button>
                    <Button variant="contained" onClick={() => handleMarkDone(selectedAssignment)}>
                        {t('Mark done')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
export default Home