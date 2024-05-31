interface ISectionHeadingProps {
    children: React.ReactNode;
}

function SectionHeading({children}: ISectionHeadingProps) {

    return (
        <h2 className={"flex items-center gap-3 py-3 text-lg"}>
            {children}
        </h2>
    )
}

export default SectionHeading;