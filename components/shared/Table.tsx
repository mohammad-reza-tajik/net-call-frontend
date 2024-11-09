"use client"

import {type ReactNode} from "react";
import {Button} from "@/components/ui/button";

export interface Header {
    label: string;
    isSortable?: boolean;
    alias?: string;
}

export interface ITableProps {
    headers: (Header | undefined)[];
    data: Record<string, any>[];
    onSortByHeader?: (header: string) => void;
    renderCell?: (header: Header, value: any, dataItem: Record<string, any>) => ReactNode | string;
    className?: string;
}

function Table({headers, data, onSortByHeader, renderCell, className}: ITableProps) {
    return (
        <table className={`border-collapse table-fixed w-full ${className}`}>
            <thead>
            <tr>
                {headers.map((header) => (
                    header &&
                    <th key={header.label} className={"py-3 text-center first:rounded-s last:rounded-e bg-primary"}>
                        {
                            !header.label.startsWith("--")  && (
                            header.isSortable && onSortByHeader ?
                                <Button variant={"ghost"} onClick={() => onSortByHeader(header.label)}>
                                    {header.alias || header.label}
                                </Button> :
                                header.alias || header.label
                            )
                        }
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((dataItem, index) => (
                <tr key={index}>
                    {headers.map((header) => (
                        header &&
                        <td className={"py-5 text-center first:rounded-s last:rounded-e border-b"} key={header.label}>
                            {renderCell ? renderCell(header, dataItem[header.label], dataItem) : dataItem[header.label]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Table;
