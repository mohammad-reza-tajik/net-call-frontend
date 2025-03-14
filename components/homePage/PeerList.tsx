"use client";

import Pagination from "@/components/shared/Pagination";
import { useSearchParams } from "next/navigation";
import Table, { type Header } from "@/components/shared/Table";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import type { IConnectedPeer } from "@/types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "@/components/shared/Icons";
import friendsSignal from "@/signals/peer/friends";
import routerSignal from "@/signals/router";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRef } from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import Loader from "@/components/shared/Loader";
import isLoadedSignal from "@/signals/isLoaded";

const ITEMS_PER_PAGE = 20;

const persianLabels: Record<keyof IConnectedPeer, string> = {
    localPeerId: "آیدی",
    deviceType: "نوع دستگاه",
    socketId: " ",
    visibility: " ",
};

function PeerList() {
    useSignals();

    const peersToShowSignal = useSignal<IConnectedPeer[]>([]);

    const currentPage = useSearchParams().get("page") || 1;

    const nameInputRef = useRef<HTMLInputElement>(null);

    peersToShowSignal.value = connectedPeersSignal.value.filter((peer) => {
        return (
            peer.localPeerId !== localPeerIdSignal.value &&
            !friendsSignal.value.some((friend) => friend.localPeerId === peer.localPeerId)
        );
    });

    const currentItems = peersToShowSignal.value.slice(
        (+currentPage - 1) * ITEMS_PER_PAGE,
        +currentPage * ITEMS_PER_PAGE,
    );

    const sortByHeaderHandler = (header: string) => {
        connectedPeersSignal.value = peersToShowSignal.value.toSorted((a, b) => {
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
            if (item === "socketId" || item === "visibility") return;

            return { isSortable: true, label: item, alias: persianLabels[item] };
        });
        return [...headers, { label: "--actionButtons" }];
    };

    const addToFriendsHandler = (dataItem: Record<keyof IConnectedPeer, any>) => {
        if (nameInputRef.current?.value.trim() === "") {
            toast.error("نام نمیتواند خالی باشد");
            return;
        }

        if (friendsSignal.value.find((item) => item.name === nameInputRef.current!.value)) {
            toast.error("دوستی با این نام از قبل وجود دارد");
            return;
        }

        friendsSignal.value = [
            ...friendsSignal.value,
            {
                localPeerId: dataItem.localPeerId,
                name: nameInputRef.current!.value,
                isOnline: true,
            },
        ];

        peersToShowSignal.value = peersToShowSignal.value.filter((item) => item.localPeerId !== dataItem.localPeerId);

        nameInputRef.current!.value = "";
        toast("به دوستان افزوده شد");
    };

    const renderCellHandler = (header: Header, data: string, dataItem: Record<keyof IConnectedPeer, any>) => {
        if (header.label === "--actionButtons") {
            return (
                <div className={"flex items-center gap-2 justify-end p-1"}>
                    <Button onClick={() => routerSignal.value?.push(`/connect?remotePeerId=${dataItem.localPeerId}`)}>
                        اتصال
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size={"icon"} variant={"outline"}>
                                <UserPlus className={"size-5"} aria-label={"افزودن به دوستان"} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className={"text-center text-xs md:text-sm"}>انتخاب نام</DialogTitle>
                                <DialogDescription className={"text-center text-xs"}>
                                    برای شناسایی و دسترسی آسانتر به این کاربر برای او نامی انتخاب کنید
                                </DialogDescription>
                            </DialogHeader>
                            <Input ref={nameInputRef} />
                            <Button onClick={() => addToFriendsHandler(dataItem)} className={"max-w-max mx-auto"}>
                                ذخیره
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        }
        return data;
    };

    if (!isLoadedSignal.value) {
        return (
            <div className={"flex justify-center items-center h-full"}>
                <Loader className={"size-10 md:size-12"} />
            </div>
        );
    }

    return (
        <>
            {peersToShowSignal.value.length === 0 ? (
                <p className={"text-xs md:text-sm flex justify-center items-center h-full"}>
                    هیچ دستگاه متصل دیگری موجود نیست
                </p>
            ) : (
                <>
                    <Table
                        headers={headersToShowHandler()}
                        data={currentItems}
                        onSortByHeader={sortByHeaderHandler}
                        renderCell={renderCellHandler}
                    />
                    <Pagination
                        totalCount={peersToShowSignal.value.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        siblingCount={0}
                    />
                </>
            )}
        </>
    );
}

export default PeerList;
