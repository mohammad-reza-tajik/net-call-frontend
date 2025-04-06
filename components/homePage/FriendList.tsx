"use client";
import { useSearchParams } from "next/navigation";
import type { IFriend } from "@/types";
import Table, { type Header } from "@/components/shared/Table";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/connectPage/ActionButton";
import { UserMinus } from "@/components/shared/Icons";
import friendsSignal from "@/signals/peer/friends";
import Pagination from "@/components/shared/Pagination";
import { useSignals } from "@preact/signals-react/runtime";
import routerSignal from "@/signals/router";
import isLoadedSignal from "@/signals/isLoaded";
import Loader from "@/components/shared/Loader";
import { closeDialog, openDialog } from "@/components/shared/Dialog";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 20;

const persianLabels: Record<keyof IFriend, string> = {
  localPeerId: "",
  name: "نام",
  isOnline: "وضعیت",
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
    const keys = Object.keys(currentItems[0]) as Array<keyof IFriend>;
    const headers = keys.map((item) => {
      if (item === "localPeerId") return;

      return { isSortable: true, label: item, alias: persianLabels[item] };
    });
    return [...headers, { label: "--actionButtons" }];
  };

  const removeFriendHandler = (dataItem: Record<keyof IFriend, any>) => {
    openDialog({
      title: "آیا از حذف دوست اطمینان دارید؟",
      content: (
        <div className={"flex flex-col gap-5"}>
          <p className={"text-sm text-center"}>{dataItem.name} &nbsp; از لیست دوستان شما حذف خواهد شد. </p>
          <div className={"flex gap-2 justify-center items-center"}>
            <Button
              onClick={() => {
                friendsSignal.value = friendsSignal.value.filter((item) => item.localPeerId !== dataItem.localPeerId);
                toast.success("از لیست دوستان حذف شد");
                closeDialog();
              }}
            >
              پذیرش
            </Button>
            <Button onClick={() => closeDialog()}>انصراف</Button>
          </div>
        </div>
      ),
    });
  };

  const renderCellHandler = (header: Header, data: string, dataItem: Record<keyof IFriend, any>) => {
    if (header.label === "--actionButtons") {
      return (
        <div className={"flex items-center gap-2 justify-end p-1"}>
          <Button
            disabled={!dataItem.isOnline}
            onClick={() => {
              routerSignal.value?.push(`/connect?remotePeerId=${dataItem.localPeerId}`);
            }}
          >
            اتصال
          </Button>

          <ActionButton
            icon={<UserMinus className={"size-5"} />}
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

  if (!isLoadedSignal.value) {
    return (
      <div className={"flex justify-center items-center h-full"}>
        <Loader className={"size-10 md:size-12"} />
      </div>
    );
  }

  return (
    <>
      {friendsSignal.value.length === 0 ? (
        <p className={"text-xs md:text-sm flex justify-center items-center h-full"}>هیچ دوستی ندارید !</p>
      ) : (
        <>
          <Table
            headers={headersToShowHandler()}
            data={currentItems}
            onSortByHeader={sortByHeaderHandler}
            renderCell={renderCellHandler}
          />
          <Pagination totalCount={friendsSignal.value.length} itemsPerPage={ITEMS_PER_PAGE} siblingCount={0} />
        </>
      )}
    </>
  );
}

export default FriendList;
