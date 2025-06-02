import {parseFromValuesOrFunc} from "material-react-table/src/utils/utils";
import {MRT_Cell, MRT_RowData, MRT_TableInstance} from "material-react-table";
import {TextFieldProps} from "@mui/material";

/**
 * Parameters for the getTextFieldProps function
 *
 * @template T - The data type for the table row
 */
interface GetMRT_TextFieldProps<T extends MRT_RowData> {
  cell: MRT_Cell<T>;
  table: MRT_TableInstance<T>;
}


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
    table
  }: GetMRT_TextFieldProps<T>): TextFieldProps => {
  const {column, row} = cell;
  const {columnDef} = column;

  return {
    variant: 'standard', //can override with columnDef.muiEditTextFieldProps: { variant: "outlined" },
    ...parseFromValuesOrFunc(table.options.muiEditTextFieldProps, {cell, column, row, table}),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {cell, column, row, table})
  };
}