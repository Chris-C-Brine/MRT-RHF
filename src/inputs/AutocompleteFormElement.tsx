// src/inputs/AutocompleteFormElement.tsx
import type {MRT_RowData} from 'material-react-table';
import {AutocompleteElement, type AutocompleteElementProps} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {getTextFieldProps} from "../utils/getTextFieldProps";
import type {EditFunctionProps} from "../types";
import {ChipTypeMap, TextFieldProps} from "@mui/material";
import {FieldPath, FieldValues} from "react-hook-form";
import {memo, type ElementType} from "react";

type AutoDefault = {
  id: string | number;
  label: string;
};

export type AutocompleteFormElementProps<
  TData extends MRT_RowData,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = AutoDefault | string | any,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap['defaultComponent']
> =
  Omit<AutocompleteElementProps<TName, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'name' | 'control' | 'textFieldProps'>
  & EditFunctionProps<TData>;

export const AutocompleteFormElement = memo(<T extends MRT_RowData>(
  {
    cell,
    column,
    table,
    row,
    ...autocompleteProps
  }: AutocompleteFormElementProps<T>) => {
  const {columnDef} = column;
  // Transfer the text field props without overwriting the core component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {component, required, ...textFieldProps}: TextFieldProps = getTextFieldProps({cell, table, row, column});

  return <AutocompleteElement
    name={column.id}
    label={columnDef.header}
    textFieldProps={{
      ...textFieldProps,
      // Update material-react-table's editing row's cached value when focus is lost
      onBlur: (e) => {
        textFieldProps?.onBlur?.(e);
        updateEditingRow(table, cell, e.target.value);
      }
    }}
    {...autocompleteProps}
    required={required || autocompleteProps?.required}
  />;
});

AutocompleteFormElement.displayName = 'AutocompleteFormElement';