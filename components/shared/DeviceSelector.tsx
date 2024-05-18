"use client"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";

interface Props {
    devices: MediaDeviceInfo[]
}

function DeviceSelector({devices}: Props) {

    const [device, setDevice] = useState("default");

    if (!devices) {
        return
    }
    
    const sortChangeHandler = (value: string) => {
        setDevice(value);
    }

    return (
        <Select onValueChange={sortChangeHandler} defaultValue={device}>
            <SelectTrigger className={"w-36 md:w-44"}>
                <SelectValue>
                    {device}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {
                    devices.map((item) => {
                        return (
                            <SelectItem value={item.deviceId} key={item.deviceId}>{item.label}</SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    )
}

export default DeviceSelector;