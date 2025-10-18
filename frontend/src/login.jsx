import React from "react";
import Typography from '@mui/material/Typography'
import { bgcolor } from "@mui/system";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Divider from '@mui/material/Divider';

function Login(){
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: "column",
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
        }}
        >
            <Typography variant="h1" sx = {{marginTop: "5vh"}}>DooDate</Typography>


            <Typography variant="h5" sx = {{marginTop: "10vh"}}>Sign in to your account</Typography>
            <Typography variant="body1" sx = {{marginTop: "1vh"}}>Enter your uOttawa email address to sign in to your DOOdate account</Typography>

            <TextField
                label = "Email Address"
                type = "email"
                placeholder="email@uOttawa.ca"
                sx = {{
                    width: "30vw",
                    marginTop: "4vh"
                }}
            />

            <TextField
                label = "Password"
                type = "password"

                sx = {{
                    width: "30vw",
                    marginTop: "2vh"
                }}
            />      

            <Typography variant = "body2" sx={{marginTop: "1vh"}}>Don't have an account? <Link href="/signup"> Sign up </Link></Typography>

            <Button
            variant="contained"
            sx = {{
                width: "20vw",
                marginTop: "4vh"
            }}>
            Login
            </Button>

            <Divider sx={{width: "30vw", marginTop: "4vh"}}>or</Divider>

            <Button
            variant="contained"
            sx = {{
                width: "20vw",
                marginTop: "4vh",
                backgroundColor: "grey"
            }}>
            Continue with Microsoft
            </Button>

            <Typography variant = "body2"  sx={{marginTop: "2vh"}}>By clicking continue, you agree to our <Link href="/signup"> Terms of Service </Link> and <Link href="/signup"> Privacy Policy </Link></Typography>

        </Box>
    )
}
export default Login