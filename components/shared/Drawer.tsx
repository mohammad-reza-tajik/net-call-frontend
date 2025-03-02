"use client"

import {useId , type ReactNode} from "react";
import cn from "@/lib/utils/cn";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";

interface IDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    direction?: "right" | "left" | "top" | "bottom";
    title?: ReactNode;
    children: ReactNode;
    overlayClassName?: HTMLDivElement["className"];
    drawerClassName?: HTMLDivElement["className"];
    headerClassName?: HTMLDivElement["className"];
}

/**
 * A reusable drawer component that slides in from a specified direction with customizable styling.
 * @param {IDrawerProps} props - The properties for configuring the drawer.
 * @returns {ReactNode} The rendered drawer component.
 */
function Drawer({
                    isOpen,
                    onClose,
                    direction = "right",
                    title,
                    children,
                    overlayClassName,
                    drawerClassName,
                    headerClassName,
                }: IDrawerProps) {


    const titleId = useId(); // Generates a unique ID for each instance

    /**
     * Determines the transform class based on the direction prop.
     * @returns {string} The Tailwind CSS transform class for sliding animation.
     */
    function getTransformClass(): string {
        if (direction === "left") {
            return isOpen ? "translate-x-0" : "-translate-x-full";
        } else if (direction === "top") {
            return isOpen ? "translate-y-0" : "-translate-y-full";
        } else if (direction === "bottom") {
            return isOpen ? "translate-y-0" : "translate-y-full";
        } else {
            return isOpen ? "translate-x-0" : "translate-x-full";
        }
    }

    /**
     * Determines the position classes based on the direction prop (width/height handled via drawerClassName).
     * @returns {string} The Tailwind CSS classes for positioning.
     */
    function getPositionClass(): string {
        if (direction === "left") {
            return "top-0 left-0 h-[100dvh] md:w-1/4";
        } else if (direction === "top") {
            return "top-0 left-0 w-screen h-[100dvh] md:h-1/2";
        } else if (direction === "bottom") {
            return "bottom-0 left-0 w-screen h-[100dvh] md:h-1/2";
        } else {
            return "top-0 right-0 h-[100dvh] w-1/2 md:w-1/4";
        }
    }

    return (
        <>
            {/* Drawer overlay */}
            <div
                className={cn(
                    `fixed inset-0 bg-foreground z-40 ${
                        isOpen ? "opacity-60" : "opacity-0 pointer-events-none"
                    }`,
                    overlayClassName
                )}
                onClick={onClose}
                aria-hidden={!isOpen} // Hide from screen readers when closed
            ></div>

            {/* Drawer content */}
            <section
                className={cn(
                    `fixed z-50 bg-background transition-transform duration-300 ease-in-out overflow-x-hidden overflow-y-auto ${getTransformClass()} ${getPositionClass()}`,
                    drawerClassName
                )}
                role={"dialog"}
                aria-modal={true}
                aria-labelledby={title ? titleId : undefined}
                aria-hidden={!isOpen}
            >
                {/* Drawer header */}
                <header
                    className={cn(
                        "p-2 border-b flex items-center",
                        headerClassName
                    )}
                >
                    <Button size={"icon"} onClick={onClose} aria-label={"بستن منو"}>
                        <Close/>
                    </Button>
                    <h2 className={"flex-1 text-center"} id={titleId}>
                        {title}
                    </h2>
                </header>
                {children}
            </section>
        </>
    );
}

export default Drawer;