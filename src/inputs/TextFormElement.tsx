// src/inputs/TextFormElement.tsx
import {MRT_RowData} from 'material-react-table';
import {TextFieldElement, TextFieldElementProps} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {TextFieldProps} from "@mui/material";
import {getTextFieldProps} from "../utils/getTextFieldProps";
import {EditFunctionProps} from "../types";

/**
 * Props for the TextFormElement component
 *
 * @template TData - The data type for the table row
 */
interface TextFormElementProps<TData extends MRT_RowData> extends Omit<TextFieldElementProps, 'name'>, EditFunctionProps<TData> {}

/**
 * A form element that renders a text field for Material React Table editing
 *
 * This component integrates react-hook-form-mui's TextFieldElement with Material React Table's
 * editing functionality. It automatically handles form state and updates the table's editing row
 * when the field value changes.
 *
 * @template TData - The data type for the table row
 * @param props - The component props including cell, column, row, and table from Material React Table
 * @returns A React component that renders a text field
 */
export const TextFormElement = <TData extends MRT_RowData>(props: TextFormElementProps<TData>) => {
  // Transfer the text field props without overwriting the core component
  const {component, required, ...textFieldProps}: TextFieldProps = getTextFieldProps(props);

  const {column, table, cell} = props;

  return <TextFieldElement
    name={column.id}
    label={column.columnDef.header}
    {...textFieldProps}
    // Update material-react-table's editing row's cached value when focus is lost
    onBlur={(e) => {
      textFieldProps?.onBlur?.(e);
      updateEditingRow(table, cell, e.target.value);
    }}
    required={required}
  />;
};