import PeerId from "@/components/shared/PeerId";
import Logo from "@/components/shared/Logo";
import DrawerButton from "@/components/shared/DrawerButton";

function Header() {


    return (
        <header className={"flex justify-between items-center p-2 py-3 border-b"}>
            <Logo className={"size-10"}/>
            <PeerId />
            <DrawerButton />
        </header>
    )
}

export default Header;