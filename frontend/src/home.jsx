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

function Home(){
    const [classFilter, setClassFilter] = React.useState('All Classes');
    let classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
    let assignments = [
        { title: 'Assignment 1', className: 'Physics', date: '2025-09-19T23:59:00', weight: '4%', colour: '#dd7777' },
        { title: 'Project Proposal', className: 'History', date: '2025-09-22T17:00:00', weight: '10%', colour: '#77dd77' },
        { title: 'Lab Report', className: 'Chemistry', date: '2025-09-25T23:59:00', weight: '6%', colour: '#7777dd' },
        { title: 'Presentation', className: 'Calculus', date: '2025-09-25T23:59:00', weight: '10%', colour: '#77dd77' },
    ];

    const assignmentsPerDay = new Map();

    for (const ai of assignments) {
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
        const { day, outsideCurrentMonth } = props;
        const key = day.format("YYYY-MM-DD");

        let todaysAssignments = assignmentsPerDay.get(key);
        if (!todaysAssignments) {
            todaysAssignments = [];
        }

        const dots = [];
        const limitedAssignments = todaysAssignments.slice(0, 3);

        for (let i = 0; i < limitedAssignments.length; i++) {
            const assignment = limitedAssignments[i];
            dots.push(
            <Box
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
        
        if (todaysAssignments.length === 0) {
            return (<Box sx={{ position: "relative" }}><PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} /></Box>);
        }

        return (
            <Box sx={{ position: "relative" }}>
              <PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} />
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
                    <DateCalendar readOnly showDaysOutsideCurrentMonth slots={{ day: AssignmentDay }}/>
                </LocalizationProvider>
            </Box>
            <Typography variant="h5" sx={{ alignSelf: 'flex-start', pl: 2, textAlign: 'left' }}>Upcoming</Typography>
            <Box sx={{ flex: 1,
                overflowY: 'auto',
                width: '100%',
                maxHeight: '40vh',
                pb: '72px',
                px: 2,
                bgcolor: 'primary.secondary' }}>
                {assignments.map((assignment) => (
                    <EventCard key={assignment.title} {...assignment} date={dayjs(assignment.date).format("MMMM D, YYYY h:mm A")} />
                ))}
            </Box>
        </Box>
    )
}
export default Home