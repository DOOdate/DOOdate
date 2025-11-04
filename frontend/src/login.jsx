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

function Login(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: "column",
            width: '100vw',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
        }}
        >
            <Typography variant="h2" sx = {{marginTop: "5vh"}}>DooDate</Typography>


            <Typography align="center" variant="h5" sx = {{marginTop: "10vh"}}>{t('Signin')}</Typography>
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
            onClick={() => navigate('/home')}
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