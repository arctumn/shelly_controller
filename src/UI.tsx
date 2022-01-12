import axios from "axios";
import { useEffect, useState } from "react";
import Border from "./border";

import { device_id_list, key } from "./Constants";
import './page.css';

type device_consuption = {
    is_valid: boolean
    power: number
    reactive: number
    total: number
    total_returned: number
    voltage: number
}
export type device = {
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
    const [power_device, setPowerDevice] = useState({device: no_info, tracking:false} )
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
        .catch(console.error)

    // Get data every 1.5 seconds about the state of the devices
    useEffect(() => {
        const intervalCall = setInterval(() => {
            //Request data of shelly device controling the solar panel
            device_id_list.map(get_data)
            //Sorts my absolute energy consuption
            incoming_data_from_devices.sort((e1, e2) => Math.abs(e1.device_use.power) > Math.abs(e2.device_use.power) ? -1 : 1)
            //Update device data on screen
            if(power_device.tracking){
                const updated = incoming_data_from_devices
                                .find(device => device.device_id === power_device.device.device_id)
                
                setPowerDevice({device:updated !== undefined ? updated : power_device.device,tracking:true})
            }
            setDevices(incoming_data_from_devices)
            incoming_data_from_devices = []
        }, 1500);
        //Clean the interval
        return () => clearInterval(intervalCall);
    }, []);


    return <div className="page">
        {devices.length !== 0 ?
            <div>
                <nav className="header">
                    <h1>Energy usage every 1.5 seconds</h1>
                    <h2> Power {power_device.device.device_use.power < 0 ?
                        "exported " : "imported "}
                        {Math.abs(power_device.device.device_use.power)} W
                    </h2>
                </nav>
                <Border />
                <h1>Device information:</h1>
                {devices.map(device =>
                    <div>
                        <div onClick={() => setPowerDevice({device:device,tracking:true})} className="left-side">
                            <p>Device status: {device.online ? "online" : "offline"}</p>
                            <p>Device ip: {device.device_ip}</p>
                            <p>Device id: {device.device_id}</p>
                            <p>Device power : {device.device_use.power} W</p>
                            <br />
                        </div>
                    </div>
                )}
            </div>
            :
            <div>
                <h1>Please wait!</h1>
                <h2>Your data is being loaded.</h2>
                <h2>Grab a drink while you wait!</h2>
            </div>}
    </div>
}

export default ShowUi;