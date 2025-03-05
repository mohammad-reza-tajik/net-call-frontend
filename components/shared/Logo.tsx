import type {AnchorHTMLAttributes} from "react";
import Link from "next/link";
import Image from "next/image";

function Logo(props:AnchorHTMLAttributes<HTMLAnchorElement>) {

    return (
        <Link href={"/"} {...props} aria-label={"لوگو"}>
            <Image src={"/images/logo.svg"} alt={"لوگو"} width={100} height={100}/>
        </Link>
    );
}

export default Logo;