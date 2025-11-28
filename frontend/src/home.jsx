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
import Button from '@mui/material/Button';
import PlusIcon from "../src/assets/plus-icon-calendar.svg";
import { useUserContext } from './userContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Home(){
    const { t } = useTranslation();
    const [classFilter, setClassFilter] = React.useState('All Classes');
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectionMode, setSelectionMode] = React.useState('day');
    const [upcomingExtended, setUpcomingExtended] = React.useState(false);
    const { data, setData } = useUserContext();
    const [assignments, setAssignments] = React.useState([]);

    
    
    React.useEffect(() => {
        
        const loadData = async () => {
            if (data == "{}") {
              let uid = localStorage.getItem('id');

              try{
                const res = await axios.get(uid ? `/api/users/${uid}` : '/api/newuser/');

                if (res.status !== 200) {
                  console.error('Error fetching user data', response);
                  return;
                } 

                const userData = res.data;

                setData(JSON.stringify(userData));

                if(userData.id !== undefined){
                  localStorage.setItem('id', userData.id);
                  console.log(userData.id);
                }
              } catch (err){
                  console.error("Error fetching user data", err);
              }                       
            }
        };
        loadData(); 
    }, [data, setData]);

    React.useEffect(() => {
      if (!data || data === "{}") return;

      try {
        const parsed = JSON.parse(data);

        const courses = Array.isArray(parsed.courses) ? parsed.courses : [];

        setAssignments(courses);
      } catch (e) {
        console.error("Invalid JSON in user context data:", data, e);
        setAssignments([]); 
      }
    }, [data]);

    
    
    dayjs.extend(updateLocale)
    dayjs.extend(localizedFormat);
    dayjs.updateLocale('fr' ,{
        months : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', "Août", 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    })
    dayjs.locale(i18next.language)

    const classNamesSet = new Set();
    for (const a1 of assignments) {
        classNamesSet.add(a1.course_code);
    }
    const classNames = [...classNamesSet]

    let filteredAssignments = [];
    for (const a of assignments) {
        for(const b of a.deadlines){
            if (classFilter == 'All Classes' || a.course_code == classFilter) {
                filteredAssignments.push({title: b.title, due_date: b.due_date, weight: b.weight, colour: a.colour, course_code: a.course_code, late_policy: a.late_policy});
            }
        }
    }

    let upcomingAssignments = [];
    for (const a of filteredAssignments) {
        if (selectedDate == null) {
            upcomingAssignments.push(a);
        }
        else{
            const assignmentDate = dayjs(a.due_date).startOf("day");
            const selected = selectedDate.startOf("day");

            if(selectionMode == "day"){
                if(dayjs(a.due_date).isSame(selectedDate, "day")){
                    upcomingAssignments.push(a);
                }
            }
            else{
                const dayOfWeek = selected.day();
                const weekStart = selected.subtract(dayOfWeek, "day");
                const diffDays = assignmentDate.diff(weekStart, "day");
          
                if (diffDays >= 0 && diffDays <= 6) {
                  upcomingAssignments.push(a);
                }
            }

        }
    }
    upcomingAssignments.sort((a, b) => dayjs(a.due_date).diff(dayjs(b.due_date))); 

    const assignmentsPerDay = new Map();

    for (const ai of filteredAssignments) {
        const date = dayjs(ai.due_date);
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

        let isInSelectedWeek = false;

        if (selectionMode == "week" && selectedDate) {
            const selected = selectedDate.startOf("day");
            const weekStart = selected.subtract(selected.day(), "day");
            isInSelectedWeek = day.startOf("day").diff(weekStart, "day") >= 0 && day.startOf("day").diff(weekStart, "day") <= 6;
        }

        const isStartOfWeek = selectionMode == "week" && isInSelectedWeek && day.day() == 0;
        const isEndOfWeek = selectionMode == "week" && isInSelectedWeek && day.day() == 6;
        const isToday = day.isSame(dayjs(), "day");

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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                      <img 
                        src={PlusIcon} 
                        style={{ width: "120%", height: "120%" }} 
                    />
                    </Box>
            )
        }

        const daySx = {
          ...(selectionMode == "day" && {
          "&.Mui-selected": {
            bgcolor: "rgba(150, 150, 150, 0.45)",
            color: "inherit",
            },

          "&.Mui-selected:hover, &.Mui-selected:focus": {
            bgcolor: "rgba(150, 150, 150, 0.45)",
          },
        }),

        ...(selectionMode == "week" && isInSelectedWeek && {
          bgcolor: "rgba(150, 150, 150, 0.45)",
          color: "inherit",

          "&:hover, &:focus": {
            bgcolor: "rgba(150, 150, 150, 0.45)",
          },    
              
          borderRadius: 0,

          ...(isStartOfWeek && {
            borderTopLeftRadius: "100%",
            borderBottomLeftRadius: "100%",
          }),
    
          ...(isEndOfWeek && {
            borderTopRightRadius: "100%",
            borderBottomRightRadius: "100%",
          }),
        }),
        };
        
        if (todaysAssignments.length == 0) {
            return (<Box sx={{ position: "relative", }}>
            <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} selected={selectionMode == "day" ? selected : false} sx={daySx} disableMargin/></Box>);
        }


        return (
            <Box sx={{ position: "relative" }}>
              <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} selected={selectionMode == "day" ? selected : false} sx={daySx} disableMargin/>
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
          {upcomingExtended == false ? (
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1, 
              flexWrap: "wrap", 
            }}>

              <Select
                sx={{width: {xs: "55vw", md: "14vw"}, height: {xs: "5.5vh", md: "5.5vh"}}}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}>

                <MenuItem value='All Classes'>{t('All Classes')}</MenuItem>
                {classNames.map((className) => (<MenuItem key={className} value={className}>{className}</MenuItem>))}
              </Select>

              <Select
                sx={{ width: {xs: "25vw", md: "7vw"}, height: {xs: "5.5vh", md: "5.5vh"}}}
                value={selectionMode}
                onChange={(e) => setSelectionMode(e.target.value)}
                size="small">

                <MenuItem value="day">{t('Day')}</MenuItem>
                <MenuItem value="week">{t('Week')}</MenuItem>
              </Select>

          </Box>) : null}
    
          <Box sx={(theme) => ({
                p: 2,
                borderRadius: 1,
                transition: 'background-color 200ms',
            })}>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18next.language}>
                {upcomingExtended == false ? (
                  <DateCalendar
                  value={selectedDate}
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

                ) : null}  
              </LocalizationProvider>
          </Box>

          <Box
          sx={{
            display: "flex",
            justifyContent: 'space-between',
            alignItems: "center",
            width: "90%",
            marginBottom: "1vh",
            marginTop: "-1vh"
            }}> 

            <Typography variant="h5" sx={{ alignSelf: 'flex-start', pl: 2, textAlign: 'left' }}>{t('Upcoming')}</Typography>
            {upcomingExtended == false ? (
              <Button variant="outlined" onClick={() => setUpcomingExtended(prev => !prev)}>Expand</Button>
              ) : <Button variant="outlined" onClick={() => setUpcomingExtended(prev => !prev)}>Collapse</Button>}
          
          </Box>
          <Box sx={{ flex: 1,
                overflowY: 'auto',
                width: '100%',
                pb: '72px',
                px: 2,
                bgcolor: 'primary.secondary',
                maxHeight: upcomingExtended ? "92vh" : "40vh",
                }}>
                {upcomingAssignments.map((assignment, index) => (
                    <EventCard key={assignment.id ?? `${assignment.title}-${index}`} title={assignment.title} colour={assignment.colour} className={assignment.course_code} {...assignment} date={dayjs(assignment.due_date).format("LLL")} weight={assignment.weight+"%"} late_policy={assignment.late_policy} />
                ))}
          </Box>
            </Box>
    )
}
export default Home