import {MRT_Cell, MRT_Column, MRT_RowData} from "material-react-table";
import {TextFieldProps} from "@mui/material";
import {EditFunctionProps} from "../types";
import {parseFromValuesOrFunc} from "./parseFromValuesOrFunc";

/**
 * Gets consistent TextField props for editing components
 *
 * This utility combines TextField props from table options and column definition,
 * as well as ensures consistent behavior across different editing components.
 *
 * @template T - The data type for the table row
 * @param options - Object containing cell and table
 * @returns TextFieldProps - The combined TextField props
 */
export const getTextFieldProps = <TData extends MRT_RowData, TValue = unknown>(
  {
    cell,
    table,
    column,
    row
  }: EditFunctionProps<TData, TValue>): TextFieldProps => {
  // Create a type-compatible object for parseFromValuesOrFunc
  const props = {
    cell: cell as MRT_Cell<TData, unknown>,
    column: column as MRT_Column<TData, unknown>,
    row,
    table
  };

  const {columnDef} = props.column;

  return {
    variant: 'standard', //suggested override with columnDef.muiEditTextFieldProps: { variant: "outlined" },
    ...parseFromValuesOrFunc(table.options.muiEditTextFieldProps, props),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, props)
  };
}