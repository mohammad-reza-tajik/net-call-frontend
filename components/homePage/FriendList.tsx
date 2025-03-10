"use client";
import {useSearchParams} from "next/navigation";
import type {IConnectedPeer} from "@/types";
import Table, {type Header} from "@/components/shared/Table";
import {Button} from "@/components/ui/button";
import ActionButton from "@/components/connectPage/ActionButton";
import {UserMinus} from "@/components/shared/Icons";
import friendsSignal from "@/signals/peer/friends";
import Pagination from "@/components/shared/Pagination";
import {useSignals} from "@preact/signals-react/runtime";
import routerSignal from "@/signals/router";
import {batch} from "@preact/signals-react";
import connectedPeersSignal from "@/signals/peer/connectedPeers";

const ITEMS_PER_PAGE = 5;

const persianLabels: Record<keyof IConnectedPeer, string> = {
    deviceType: "",
    visibility: "",
    socketId: "",
    localPeerId: "",
    name: "نام",
    isOnline: "وضعیت"
};

function FriendList() {

    useSignals();

    const currentPage = useSearchParams().get("page") || 1;

    const currentItems = friendsSignal.value.slice((+currentPage - 1) * ITEMS_PER_PAGE, +currentPage * ITEMS_PER_PAGE);

    const sortByHeaderHandler = (header: string) => {
        friendsSignal.value = friendsSignal.value.toSorted((a, b) => {
            // @ts-expect-error since headers are of type any
            if (a[header] < b[header]) return -1;
            // @ts-expect-error  since headers are of type any
            if (a[header] > b[header]) return 1;
            return 0;
        });
    };

    const headersToShowHandler = () => {
        const keys = Object.keys(currentItems[0]) as Array<keyof IConnectedPeer>;
        const headers = keys.map((item) => {
            if (item === "localPeerId" || item === "deviceType" || item === "visibility" || item === "socketId") return;

            return {isSortable: true, label: item, alias: persianLabels[item]};

        });
        return [...headers, {label: "--actionButtons"}];
    };

    const removeFriendHandler = (dataItem: Record<keyof IConnectedPeer, any>) => {
        batch(() => {
            friendsSignal.value = friendsSignal.value.filter((item) => item.localPeerId !== dataItem.localPeerId);
            connectedPeersSignal.value = [...connectedPeersSignal.value, dataItem];
        });
    };

    const renderCellHandler = (header: Header, data: string, dataItem: Record<keyof IConnectedPeer, any>) => {
        if (header.label === "--actionButtons") {
            return (
                <div className={"flex items-center gap-2 justify-end p-1"}>
                    <Button disabled={!dataItem.isOnline} onClick={() => {
                        routerSignal.value?.push(`/connect?remotePeerId=${dataItem.localPeerId}`);
                    }}>
                        اتصال
                    </Button>

                    <ActionButton
                        icon={<UserMinus className={"size-5"}/>}
                        tooltipContent={"حذف از دوستان"}
                        handler={() => removeFriendHandler(dataItem)}
                    />
                </div>
            );

        } else if (header.label === "isOnline") {
            return dataItem.isOnline ? "آنلاین" : "آفلاین";
        }

        return data;
    };

    return (
        <>
            {
                friendsSignal.value.length === 0 ?
                    <p className={"text-center p-5 text-xs md:text-sm"}>
                        هیچ دوستی ندارید !
                    </p> :
                    <>
                        <Table headers={headersToShowHandler()} data={currentItems} onSortByHeader={sortByHeaderHandler}
                               renderCell={renderCellHandler}/>
                        <Pagination totalCount={friendsSignal.value.length} itemsPerPage={ITEMS_PER_PAGE}
                                    siblingCount={0}/>
                    </>
            }
        </>
    );

}

export default FriendList;