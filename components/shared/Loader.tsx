import cn from "@/lib/utils/cn";

interface ILoaderProps {
    className?: string;
}

function Loader({className}: ILoaderProps) {
    return <span className={cn("size-7 border-2 border-primary border-x-transparent rounded-full inline-block animate-spin", className)}></span>;
}

export default Loader;