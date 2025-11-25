import React from "react";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import firebaseApp, {requestNotifications} from "./firebase"
// Use a static public asset so you can drop `logo.png` into `frontend/public` and
// the app will load it without a build-time import.
// Put your PNG at: frontend/public/logo.png
import { useColorScheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useUserContext } from './userContext.jsx';

function Login(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, setData } = useUserContext();
    
    const { mode } = useColorScheme();
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    // const invert = mode === "system" ? (prefersDark ? 1 : 0) : (mode === "dark" ? 1 : 0);
    // We switched to an SVG logo (`/logo.svg`). SVGs often carry their own colors
    // so we shouldn't globally invert them — that turns white logos to black.
    // Only apply the invert filter for raster images (e.g. PNG) if needed.
    // const logoIsSvg = true; // set to true because we're using /logo.svg
    // const imgFilter = logoIsSvg ? 'none' : `invert(${invert})`;
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: "column",
            width: '100vw',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
        }}
        >
            <Box
                component="img"
                src={'/logo.svg'}
                alt="DOOdate Logo"
                sx={{
                    // make the logo noticeably larger across breakpoints
                    width: { xs: "80vw", sm: "60vw", md: "40vw" },
                    // increase the max width so it doesn't clamp too early
                    maxWidth: "180px",
                    marginTop: "0vh",
                    // significantly reduce space below the logo
                    marginBottom: "-2vh",
                    filter: `invert(${mode === "system" ? prefersDark ? 0 : 1 : mode === "dark" ? 0 : 1})`
                }}
            />

            {/* Optional name under the logo — helps recognition on small screens 
            <Typography variant="h4" sx={{ marginTop: 0, fontWeight: 700 }}>{'DOOdate'</Typography>*/}

            <Typography variant="h5" sx = {{marginTop: "1.5vh"}}>{t('Signin')}</Typography>
            <Typography align="center" variant="body1" sx = {{marginTop: "1vh", mx: "2vw"}}>{t('Enter email')}</Typography>

            <TextField
                label = {t('Email')}
                type = "email"
                placeholder="email@uOttawa.ca"
                sx = {{
                    width: { xs: "85vw", md: "30vw",},
                    marginTop: "4vh"
                }}
            />

            <TextField
                label = {t('Password')}
                type = "password"

                sx = {{
                    width: { xs: "85vw", md: "30vw",},
                    marginTop: "2vh"
                }}
            />      

            <Typography align="center" variant = "body2" sx={{marginTop: "1vh"}}>{t('NoAccount')} <Link href="/signup"> {t('SignUp')} </Link></Typography>

            <Button
            variant="contained"
            sx = {{
                width: { xs: "85vw", md: "30vw",},
                marginTop: "4vh",
                backgroundColor: "primary.main",
                color: "primary.base"
            }}
            onClick={() => {
                requestNotifications();
                axios.get('/api/courses/0').then((response) => {
                    if (response.status !== 200) {
                        console.error('Error fetching user data', response);
                    } else {
                        let t = JSON.parse(data);
                        t.courses = response.data; 
                        setData(JSON.stringify(t));
                        navigate('/home');
                    }
                })
            }}
            >
            {t('LOGIN')}
            </Button>

            <Divider sx={{width: "30vw", marginTop: "4vh"}}>{t('OR')}</Divider>

            <Button
            variant="contained"
            sx = {{
                width: { xs: "85vw", md: "30vw",},
                marginTop: "4vh",
                backgroundColor: "primary.light",
                color: "#000000"
            }}>
            {t('Continue Microsoft')}
            </Button>

            <Typography align="center" variant = "body2"  sx={{marginTop: "2vh", mx: "2vw"}}>{t('Contract')}<Link href="/signup"> {t('TOS')} </Link> {t('and')} <Link href="/signup"> {t('PP')} </Link></Typography>

        </Box>
    )
}
export default Login