import PeerId from "@/components/shared/PeerId";
import Logo from "@/components/shared/Logo";
import DrawerButton from "@/components/shared/DrawerButton";

function Header() {


    return (
        <header className={"flex justify-between items-center p-5 border-b"}>
            <Logo className={"size-10"}/>
            <PeerId />
            <DrawerButton />
        </header>
    )
}

export default Header;