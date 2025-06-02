// src/columns/textColumn.tsx
import {MRT_ColumnDef, MRT_RowData} from 'material-react-table';
import {TextFieldElement} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {ChangeEvent} from "react";
import {TextFieldProps} from "@mui/material";
import {getTextFieldProps} from "../utils/getTextFieldProps";

export interface TextColumnProps<T extends MRT_RowData> extends Omit<MRT_ColumnDef<T>, "Edit"> {
}

export function textColumn<T extends MRT_RowData>(rest: TextColumnProps<T>): MRT_ColumnDef<T> {
  return {
    ...rest,
    Edit: ({cell, row, column, table}) => {

      const {getState, options: {createDisplayMode, editDisplayMode}} = table
      const {columnDef} = column;
      const {creatingRow} = getState();
      const isCreating = creatingRow?.id === row.id;

      const handleOnChange = (_e: ChangeEvent, newValue: string) => {
        updateEditingRow(table, cell, newValue);
      };

      const {component, ...textFieldProps}: TextFieldProps = getTextFieldProps({cell, table});

      return <TextFieldElement
        name={column.id}
        {...textFieldProps}
        label={
          ['custom', 'modal'].includes(
            (isCreating ? createDisplayMode : editDisplayMode) as string
          )
            ? columnDef.header
            : undefined
        }
      />;
    },
  };
}