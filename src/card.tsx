import { device } from "./UI";
interface devices_prop { devices: device[]}

const Card: React.FC<devices_prop> = ({devices}) => {
    return <div>
    {devices.map((device) =>
        <div className="left-side">
            <p>Device status: {device.online ? "online" : "offline"}</p>
            <p>Device ip: {device.device_ip}</p>
            <p>Device id: {device.device_id}</p>
            <p>Device power : {device.device_use.power} W</p>
            <br />
        </div>
    )}
</div>
}
export default Card;