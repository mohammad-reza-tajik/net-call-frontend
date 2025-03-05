import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Warning} from "@/components/shared/Icons";

function NotFound() {

    return (
        <section className={"flex flex-col flex-1 justify-center items-center gap-10"}>
            <Warning  className={"size-24 lg:size-72"}/>
            <h2 className={"text-2xl lg:text-3xl"}>صفحه مورد نظر شما پیدا نشد</h2>
            <Button asChild>
                <Link href="/">
                    بازگشت به صفحه اصلی
                </Link>
            </Button>
        </section>
    );
}

export default NotFound;