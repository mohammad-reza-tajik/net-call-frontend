"use client"

import Pagination from "@/components/shared/Pagination";
import {useSearchParams} from "next/navigation";
import Table from "@/components/shared/Table";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import {useSignals} from "@preact/signals-react/runtime";
import type {IConnectedPeer} from "@/types";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

const persianLabels: Record<keyof IConnectedPeer, string> = {

    localPeerId: "آیدی",
    deviceType: "نوع دستگاه",
    socketId: " "
};

function PeerList() {

    useSignals();

    const currentPage = useSearchParams().get("page") || 1;

    const currentItems = connectedPeersSignal.value.slice((+currentPage - 1) * ITEMS_PER_PAGE, +currentPage * ITEMS_PER_PAGE);

    function sortByHeaderHandler(header: string) {
        connectedPeersSignal.value = connectedPeersSignal.value.toSorted((a, b) => {
            // @ts-ignore
            if (a[header] < b[header]) return -1;
            // @ts-ignore
            if (a[header] > b[header]) return 1;
            return 0;
        });
    }

    function headersToShowHandler() {
        const keys = Object.keys(currentItems[0]) as Array<keyof IConnectedPeer>;
        const headers = keys.map((item) => {
            if (item !== "socketId") {
                return {isSortable: true, label: item, alias: persianLabels[item]};
            } else {
                return undefined;
            }
        });
        return [...headers, {label : "--connectButtons"}];
    }

    function renderCellHandler(header: any, data: string, dataItem : Record<keyof IConnectedPeer, any>) {
        if (header.label.startsWith("--")) {
            return <Button asChild>
                <Link href={`/connect?remotePeerId=${dataItem.localPeerId}`}>
                    اتصال
                </Link>
            </Button>
        }
        return data;
    }

    return (
        <>
            {
                connectedPeersSignal.value.length === 0 ?
                    <p className={"text-center p-5 text-xs md:text-sm"}>هیچ دستگاه متصل دیگری موجود نیست</p> :
                    <>
                        <Table headers={headersToShowHandler()} data={currentItems} onSortByHeader={sortByHeaderHandler}
                               renderCell={renderCellHandler}/>
                        <Pagination totalCount={connectedPeersSignal.value.length} itemsPerPage={ITEMS_PER_PAGE}
                                    siblingCount={0}/>
                    </>
            }
        </>
    )
}

export default PeerList;