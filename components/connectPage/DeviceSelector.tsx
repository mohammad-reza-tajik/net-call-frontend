"use client"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useSignal} from "@preact/signals-react";

interface Props {
    devices?: MediaDeviceInfo[];
    text?: string;
}

function DeviceSelector({devices, text}: Props) {

    const device = useSignal("default");

    if (!devices) {
        return
    }

    const sortChangeHandler = (value: string) => {
        device.value = value;
    }

    return (
        <div className={"flex items-center gap-5"}>
            <p className={"text-sm"}>{text}</p>
            <Select onValueChange={sortChangeHandler} defaultValue={device.value}>
                <SelectTrigger className={"w-36 md:w-44"}>
                    <SelectValue>
                        {device.value}
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
        </div>
    )
}

export default DeviceSelector;