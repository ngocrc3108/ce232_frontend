import React, { useState, useEffect } from 'react'
import Device from "../components/device"
import { useNavigate } from 'react-router-dom'; 
import mainStyle from '../styles/home.module.css'
import deviceStype from '../styles/device.module.css'
import Button from '@mui/material/Button';
import { Outlet } from "react-router-dom";
import { createContext  } from "react";
import Stack from '@mui/material/Stack';
import { myFetch } from '../App';

export const HomeContext = createContext(null);

function Home({loggedIn}) {
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    
    const logoutHandler = () => {
        myFetch('/auth/logout')
        .then(res => {
            if(res.success)
                navigate('/login')
            console.log(res)
        })
    }

    useEffect(() => {
        if(loggedIn === false)
            navigate("/login")
    }, [loggedIn]);

    useEffect(() => {
        // load initial devices
        myFetch('/device', {
            method : 'GET'
        })
        .then(res => {
            console.log("fetch devices", res)
            setDevices(res)
        })
    }, [])

    return (
        <div>
            <HomeContext.Provider value={setDevices} >
                {loggedIn === false ? <div/> :
                    (<div className={mainStyle.body_container}>
                        <Stack
                            spacing={10} 
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button sx={{width : 125}} variant="contained" onClick={() => navigate('/add')}>Add device</Button>
                            <Button sx={{width : 125}} variant="contained" onClick={logoutHandler}>Logout</Button>
                        </Stack>
                        <div className={deviceStype.device_container}>
                            {devices.map(device => <Device key={device._id} device={device} />)}
                        </div>

                        <Outlet/>
                    </div>
                    )
                } 
            </HomeContext.Provider>
        </div>
    );
}

export default Home