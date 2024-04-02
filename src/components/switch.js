import { useState, useContext, useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { DeviceContext } from "./device";
import { AppContext } from "../App";
import LiSwitch from '@mui/material/Switch';
import style from '../styles/device.module.css'

function Switch({ onChange }) {
    const {socket} = useContext(AppContext)
    const {device, setIsConnected} = useContext(DeviceContext)
    const [status, setStatus] = useState(() => device.status);
    const [loading, setLoading] = useState(() => false);

    useEffect(() => {
        socket.on(`res/${device._id}/state`, ({success}) => {
            console.log(`res/${device._id}/state`)
            if(!success) {
                setIsConnected(false)
                console.log("can not handle request")
            } else {
                setLoading(false)
                console.log("handle request successfully")
            }
        })
        return () => {
            socket.off(`res/${device._id}/state`)
        }        
    }, [])

    return (
        <div className={style.switch_containter}>
            <label>
                { device.type === "door" ? (status ? "OPEN" : "CLOSE") : (status ? "ON" : "OFF")}    
                <LiSwitch 
                    checked={status}
                    onChange={(event) => {
                        setLoading(true)
                        onChange(event, setStatus, device)
                    }}
                />
            </label>
            <div className={style.switch_loading}>
                <SyncLoader loading={loading} size={7} color="#36d7b7"/>
            </div>
        </div>
    );
}

export default Switch;