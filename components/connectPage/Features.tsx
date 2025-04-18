"use client";

import features from "@/constants/features";
import ActionButton from "@/components/connectPage/ActionButton";
import statusSignal from "@/signals/peer/status";
import getDeviceType from "@/core/getDeviceType";

function Features() {
  if (statusSignal.value) {
    return;
  }

  return (
    <div className={"flex justify-center items-center gap-3 p-2 border-t border-dashed"}>
      {features.map((item, index) => {
        // hide screen share button on mobile devices
        if (getDeviceType() === "mobile" && item.name === "screen-share") return;
        return (
          <ActionButton
            key={index}
            icon={item.icon}
            tooltipContent={item.tooltipContent}
            handler={item.handler}
          />
        );
      })}
    </div>
  );
}

export default Features;
