import { useEffect, useState, useContext } from "react";
import Switch from "./switch";
import { AppContext, myFetch } from "../App";
import Slider from '@mui/material/Slider';
import style from '../styles/device.module.css'
import SyncLoader from "react-spinners/SyncLoader";
import { onOffHandler, DeviceContext } from "./device"

const marks = [
    {
        value: 0,
        label: "LOW",
    },
    {
        value: 1,
        label: "NORMAL",
    },
    {
        value: 2,
        label: "HIGH",
    },
];

export default function Fan() {

    const {socket} = useContext(AppContext)
    const {device, setIsConnected} = useContext(DeviceContext)
    const [level, setLevel] = useState(() => device.level);
    const [sliderLoading, setSliderLoading] = useState(() => false)

    useEffect(() => {
        socket.on(`res/${device._id}/level`, ({success}) => {
            console.log(`res/${device._id}/level`)
            if(!success) {
                setIsConnected(false)
                console.log("can not handle request")
            } else {
                setSliderLoading(false)
                console.log("handle request successfully")
            }
        })
        return () => {
            socket.off(`res/${device._id}/level`)
        }        
    }, [])

    const onSliderChange = (event) => {
        console.log("slider change")
        const {value} = event.target
        setLevel(value);
        setSliderLoading(true)
        myFetch(`/device/${device.type}/level`, {
            body : {
                level : value,
                deviceId : device._id
            }
        })
        .then(res => console.log(res))        
    }

    return (
        <div>
            <Switch onChange={onOffHandler}></Switch>
            <div className={style.slider_containter}>
                <div className={style.slider}>
                <Slider
                    value={level}
                    step={null}
                    min={0}
                    max={2}
                    marks= {marks}
                    aria-label="Restricted values"
                    valueLabelDisplay="off"
                    onChange={onSliderChange}
                />
                </div>
                <div className={style.slider_loading}>
                    <SyncLoader loading={sliderLoading} size={7} color="#36d7b7"/>
                </div>
            </div>
        </div>
    );
}