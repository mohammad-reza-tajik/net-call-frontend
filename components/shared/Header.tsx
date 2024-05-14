"use client"
import PeerId from "@/components/shared/PeerId";
import {Button} from "@/components/ui/button";
import {Envelope} from "@/components/shared/Icons";
import {drawerActions, useAppDispatch} from "@/store";
import Logo from "@/components/shared/Logo";

function Header() {


    const dispatch = useAppDispatch();

    return (
        <header className={"flex justify-between items-center p-5 border-b"}>
            <Logo className={"size-10"}/>
            <PeerId />
            <Button size={"icon"} onClick={()=> dispatch(drawerActions.openDrawer())}>
                <Envelope className={"size-8"} />
            </Button>
        </header>
    )
}

export default Header;