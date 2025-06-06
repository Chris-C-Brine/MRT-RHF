// src/inputs/TextFormElement.tsx
import {MRT_RowData} from 'material-react-table';
import {TextFieldElement} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {TextFieldProps} from "@mui/material";
import {getTextFieldProps} from "../utils/getTextFieldProps";
import {EditFunctionProps} from "../types";

export const TextFormElement = <T extends MRT_RowData>({cell, column, table}: EditFunctionProps<T>) => {
  const {columnDef} = column;
  // Transfer the text field props without overwriting the core component
  const {component, required, ...textFieldProps}: TextFieldProps = getTextFieldProps({cell, table});

  return <TextFieldElement
    name={column.id}
    label={columnDef.header}
    {...textFieldProps}
    // Update material-react-table's editing row's cached value when focus is lost
    onBlur={(e) => {
      textFieldProps?.onBlur?.(e);
      updateEditingRow(table, cell, e.target.value);
    }}
    required={required}

  />;
}