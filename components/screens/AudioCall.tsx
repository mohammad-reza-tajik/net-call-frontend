import {ArrowsLeftRight, Phone} from "@/components/shared/Icons";
import cn from "@/lib/utils/cn";
import {Fragment} from "react";

function AudioCall() {

    return (
        <div className={"flex flex-col md:flex-row size-full justify-center items-center gap-2 md:gap-5"}>
            {
                Array.from({length: 2}).map((_, index) => {
                    return (
                        <Fragment key={index}>
                            <div className={"flex justify-center items-center size-52 lg:size-96 border rounded"}>
                                <Phone className={"size-14 md:size-20"}/>
                            </div>
                            <ArrowsLeftRight
                                className={cn("max-md:rotate-90 size-10 self-center", {"hidden": index !== 0})}/>
                        </Fragment>
                    );
                })
            }
        </div>
    );
}

export default AudioCall;