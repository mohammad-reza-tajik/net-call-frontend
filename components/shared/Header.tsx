import PeerId from "@/components/shared/PeerId";
import Logo from "@/components/shared/Logo";
import RequestDrawerButton from "@/components/shared/RequestDrawerButton";

function Header() {


    return (
        <header className={"flex justify-between items-center p-2 py-3 border-b"}>
            <Logo className={"size-10"}/>
            <PeerId />
            <RequestDrawerButton />
        </header>
    );
}

export default Header;