import React from "react";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch'
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled, useColorScheme  } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

function Settings(){
  const { mode, setMode } = useColorScheme();
  let [checked, setChecked] = React.useState(false)
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const hasrun = React.useRef(false)
  React.useEffect(() => {
    if(!hasrun.current && mode !== undefined){
      hasrun.current = true
      if (mode === 'system') {
        setChecked(prefersDark);
        let tmp = "light"
        if(prefersDark){
          tmp = "dark"
        }
        setMode(tmp)
        } else {
          if(mode === "dark"){
            setChecked(true);
          } else{
            setChecked(false);
          }
        }
    }
    
  }, [mode]);
  
  const handleChange = () =>{
    let metaTheme = document.querySelector('meta[name="theme-color"]'); 
    let tempbool = !checked
    setChecked(tempbool)
    if(tempbool){
      setMode("dark")
      metaTheme.setAttribute('content', '#000000');
    } else{
      setMode("light")
      metaTheme.setAttribute('content', '#ffffff');
    }
  };

    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: "column",
            width: '100vw',
            height: '100vh',
            alignItems: 'left',
            justifyContent: 'left',
            bgcolor: 'background.default',
            color: 'text.primary',
        }}
        >
            <Typography sx={{ml: '5vw', mt: '2vh'}}align="left" variant="h4">View Settings</Typography>
            <FormGroup sx={{mr: 'auto', mt: '2vh'}}>
                <FormControlLabel sx={{'& .MuiFormControlLabel-label': {marginRight: '60vw'},}} control={<IOSSwitch checked={checked} onChange={handleChange}  />} label="Dark Mode" labelPlacement='start'/>
            </FormGroup>
        </Box>
    )
}
export default Settings

