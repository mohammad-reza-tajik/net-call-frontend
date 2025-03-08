import PeerId from "@/components/shared/PeerId";
import Logo from "@/components/shared/Logo";
import RequestDrawerButton from "@/components/shared/RequestDrawerButton";
import VisibilitySwitch from "@/components/shared/VisibilitySwitch";

function Header() {


    return (
        <header className={"flex justify-between items-center p-2 py-3 border-b"}>
            <Logo className={"size-10"}/>
            <PeerId/>
            <div className={"flex items-center gap-3"}>
                <VisibilitySwitch/>
                <RequestDrawerButton/>
            </div>
        </header>
    );
}

export default Header;