import axios from "axios";
import { useEffect, useState } from "react";
import { id_painel, key, id_edp } from "./Constants";
import './page.css';

type device_consuption = {
    is_valid: boolean
    power: number
    reactive: number
    total: number
    total_returned: number
    voltage: number
}
type device = {
    online: boolean,
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
    const [devices, setDevices] = useState([no_info, no_info])

    let panel_data = no_info;
    let energy_provider_data = no_info;

    const get_data_panel = () => fetch_data(id_painel, key)
        .then(body => {
            const data = body.data.data
            panel_data = {
                online: data.online,
                device_use: data.device_status.emeters[0]
            }
        })
        .catch(console.error)

    const get_data_edp = () => fetch_data(id_edp, key)
        .then(body => {
            const data = body.data.data
            energy_provider_data = {
                online: data.online,
                device_use: data.device_status.emeters[0]
            }
        })
        .catch(console.error)

    // Get data every 5 seconds about the state of the devices
    useEffect(() => {
        const intervalCall = setInterval(() => {
            //Request data of shelly device controling the solar panel
            get_data_panel();
            //Await the time of the API limit
            setInterval(() => { }, 1000)
            //Request data of shelly device controling the energy provider
            get_data_edp();
            //Update device data on screen
            setDevices([panel_data, energy_provider_data])
        }, 4000);
        //Clean the interval
        return () => clearInterval(intervalCall);
    }, []);

    return <div className="page">
        {devices[0].online && devices[1].online ?
            <div>
                <h1>Energy usage every 5 seconds</h1>
                <h2>Power {devices[1].device_use.power < 0 ? "exported " : "imported "} {Math.abs(devices[1].device_use.power)} W </h2>
                <h2>Device information</h2>
                <hr
                    style={{
                        borderBottomColor: 'black',
                        margin:'5px',
                        borderRadius:'1em',
                        borderBottomWidth: '0.5em',
                    }}
                />
                <div>
                    {devices.map((device, index) =>
                        <div className={index % 2 === 0 ? "left-side" : "right-side"}>
                            <p>Device status: {device.online ? "online" : "offline"}</p>
                            <p>Device power information: {device.device_use.power} W</p>
                            <br />
                        </div>
                    )}
                </div>
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