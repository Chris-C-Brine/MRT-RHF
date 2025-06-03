// src/columns/textColumn.tsx
import {MRT_ColumnDef, MRT_RowData} from 'material-react-table';
import {TextFieldElement} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {TextFieldProps} from "@mui/material";
import {getTextFieldProps} from "../utils/getTextFieldProps";

export interface TextColumnProps<T extends MRT_RowData> extends Omit<MRT_ColumnDef<T>, "Edit"> {
}

export function textColumn<T extends MRT_RowData>(rest: TextColumnProps<T>): MRT_ColumnDef<T> {
  return {
    ...rest,
    Edit: ({cell, column, table}) => {
     const {columnDef} = column;
     // Transfer the text field props without overwriting the core component
      const {component, ...textFieldProps}: TextFieldProps = getTextFieldProps({cell, table});

      // Update material-react-table's editing value focus is lost
      const handleOnBlur: TextFieldProps['onBlur'] = (e) => {
        updateEditingRow(table, cell, e.target.value);
      }

      return <TextFieldElement
        name={column.id}
        label={columnDef.header}
        {...textFieldProps}
        onBlur={handleOnBlur}
      />;
    },
  };
}