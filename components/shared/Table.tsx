"use client"

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Interface for the header of a table column.
 */
export interface Header {
    /** The label to be displayed in the table header. */
    label: string;
    /** Whether the column is sortable. */
    isSortable?: boolean;
    /** An alias for the label, which will be displayed instead of the label if provided. */
    alias?: string;
}

/**
 * Props interface for the Table component.
 */
export interface ITableProps {
    /** Array of headers for the table columns. */
    headers: (Header | undefined)[];
    /** Array of data objects to be displayed in the table rows. */
    data: Record<string, any>[];
    /** Callback function to handle sorting by a specific header. */
    onSortByHeader?: (header: string) => void;
    /** Custom rendering function for table cells. */
    renderCell?: (header: Header, value: any, dataItem: Record<string, any>) => ReactNode | string;
    /** Additional class name for the table element. */
    className?: string;
}

/**
 * A reusable table component that displays data in a tabular format with optional sorting and custom cell rendering.
 * If the header label starts with `--`, the label will not be shown in the table.
 * @param {ITableProps} props - The properties for the Table component.
 * @returns {JSX.Element} - The rendered table.
 */
function Table({ headers, data, onSortByHeader, renderCell, className }: ITableProps): JSX.Element {
    return (
        <table className={`border-collapse table-fixed w-full ${className}`}>
            <thead>
            <tr>
                {headers.map((header) => (
                    header && (
                        <th key={header.label} className={"py-3 text-center first:rounded-s last:rounded-e bg-primary"}>
                            {
                                !header.label.startsWith("--") && (
                                    header.isSortable && onSortByHeader ?
                                        <Button variant={"ghost"} onClick={() => onSortByHeader(header.label)}>
                                            {header.alias || header.label}
                                        </Button> :
                                        header.alias || header.label
                                )
                            }
                        </th>
                    )
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((dataItem, index) => (
                <tr key={index}>
                    {headers.map((header) => (
                        header && (
                            <td className={"py-5 text-center text-xs md:text-base first:rounded-s last:rounded-e border-b"} key={header.label}>
                                {renderCell ? renderCell(header, dataItem[header.label], dataItem) : dataItem[header.label]}
                            </td>
                        )
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Table;
