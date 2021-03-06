import axios from "axios";
import { useEffect, useState } from "react";
import Border from "./border";

import { device_id_list, key } from "./Constants";
import './page.css';

interface device_consuption {
    is_valid: boolean
    power: number
    reactive: number
    total: number
    total_returned: number
    voltage: number
}
export interface device {
    online: boolean,
    device_ip: string,
    device_id: string,
    device_use: device_consuption
}
const fetch_data = async (device_id: string, access_key: string) => {
    return axios.post(
        "https://shelly-30-eu.shelly.cloud/device/status",
        {},
        {
            params: {
                id: device_id,
                auth_key: access_key
            }
        }
    )
}
const no_info: device = {
    online: false,
    device_ip: "localhost",
    device_id: "########",
    device_use: {
        is_valid: false,
        power: 0,
        reactive: 0,
        total: 0,
        total_returned: 0,
        voltage: 0
    }
}

const ShowUi = () => {
    const [devices, setDevices] = useState([] as device[])
    
    let incoming_data_from_devices = [] as device[]

    const get_data = (device_id: string) => fetch_data(device_id, key)
        .then(body => {
            const data = body.data.data
            incoming_data_from_devices.push({
                online: data.online,
                device_ip: data.device_status.wifi_sta.ip,
                device_id: data.device_status.mac,
                device_use: data.device_status.emeters ? data.device_status.emeters[0] : data.device_status.meters[0]
            })
        })
        .catch(_ => incoming_data_from_devices.push(
                {
                    online: no_info.online,
                    device_ip: no_info.device_ip,
                    device_id: device_id? device_id : no_info.device_id,
                    device_use: no_info.device_use
                }
            )
        )
    

    // Get data every 3 seconds about the state of the devices
    useEffect(() => {
        const intervalCall = setInterval(() => {
            //Request data of shelly device controling the solar panel
            device_id_list.map(get_data)
            //Sorts my absolute energy consuption
            incoming_data_from_devices.sort((e1, e2) => Math.abs(e1.device_use.power) > Math.abs(e2.device_use.power) ? -1 : 1)
            //Update device data on screen
            setDevices(incoming_data_from_devices)
            incoming_data_from_devices = []
        }, 3000);
        //Clean the interval
        return () => clearInterval(intervalCall);
    }, []);


    return <div className="page">
            <div>
                <nav className="header">
                    <h1>Energy usage every 3 seconds</h1>
                </nav>
                <Border />
                
                {devices.length !== 0 ?
                <div>
                <h1>Device information:</h1>
                <div className="container">{devices.map(device =>
                    <div>
                        <div className="left-side">
                            <p>Device status: {device.online ? "online" : "offline"}</p>
                            <p>Device ip: {device.device_ip}</p>
                            <p>Device id: {device.device_id}</p>
                            <p>Device power : {device.device_use.power} W</p>
                        </div>
                    </div>
                )}</div>
                </div>
            :
            <div>
                <h1>Please wait!</h1>
                <h2>Your data is being loaded.</h2>
                <h2>Grab a drink while you wait!</h2>
                <br></br> 
                <div className="loader"></div>
            </div>}
            </div>
    </div>
}

export default ShowUi;