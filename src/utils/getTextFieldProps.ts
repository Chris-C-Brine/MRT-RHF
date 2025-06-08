import {MRT_RowData} from "material-react-table";
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
export const getTextFieldProps = <T extends MRT_RowData>(
  {
    cell,
    table,
    column,
    row
  }: EditFunctionProps<T>): TextFieldProps => {
  const {columnDef} = column;

  return {
    variant: 'standard', //suggested override with columnDef.muiEditTextFieldProps: { variant: "outlined" },
    ...parseFromValuesOrFunc(table.options.muiEditTextFieldProps, {cell, column, row, table}),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {cell, column, row, table})
  };
}