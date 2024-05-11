"use client"
import PeerId from "@/components/shared/PeerId";
import {Button} from "@/components/ui/button";
import {Devices} from "@/components/shared/Icons";
import {drawerActions, useAppDispatch} from "@/store";
import Logo from "@/components/shared/Logo";

function Header() {


    const dispatch = useAppDispatch();

    return (
        <header className={"flex justify-between items-center p-5 border-b"}>
            <Logo className={"size-10"}/>
            <PeerId />
            <Button size={"icon"} onClick={()=> dispatch(drawerActions.openDrawer())}>
                <Devices className={"size-5"} />
            </Button>
        </header>
    )
}

export default Header;