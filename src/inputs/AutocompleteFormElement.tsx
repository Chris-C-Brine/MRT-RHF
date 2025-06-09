// src/inputs/AutocompleteFormElement.tsx
import {MRT_Cell, MRT_RowData, MRT_TableInstance} from 'material-react-table';
import {AutocompleteElement, type AutocompleteElementProps} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {getTextFieldProps} from "../utils/getTextFieldProps";
import {ChipTypeMap, TextFieldProps} from "@mui/material";
import {FieldPath, FieldValues} from "react-hook-form";
import {type ElementType} from "react";

/**
 * Props for the AutocompleteFormElement component
 *
 * @template TData - The data type for the table row
 * @template TValue - The value type for the autocomplete field
 * @template Multiple - Whether multiple selections are allowed
 * @template DisableClearable - Whether clearing the field is disabled
 * @template FreeSolo - Whether free text input is allowed
 * @template ChipComponent - The component type for chips in multiple selection mode
 * @template TFieldValues - The field values type for react-hook-form
 * @template TName - The name type for the form field
 */
export type AutocompleteFormElementProps<
  TData extends MRT_RowData,
  TValue = unknown,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap['defaultComponent'],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<AutocompleteElementProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent, TFieldValues, TName>, 'name' | 'control' | 'textFieldProps'> & {
  cell: MRT_Cell<TData, TValue>;
  table: MRT_TableInstance<TData>;
}

/**
 * A form element that renders an Autocomplete field for Material React Table editing
 *
 * This component integrates react-hook-form-mui's AutocompleteElement with Material React Table's
 * editing functionality. It automatically handles form state and updates the table's editing row
 * when the field value changes.
 *
 * @template TData - The data type for the table row
 * @template TValue - The value type for the autocomplete field
 * @template TFieldValues - The field values type for react-hook-form
 * @template TName - The name type for the form field
 * @template Multiple - Whether multiple selections are allowed
 * @template DisableClearable - Whether clearing the field is disabled
 * @template FreeSolo - Whether free text input is allowed
 * @template ChipComponent - The component type for chips in multiple selection mode
 *
 * @param props - The component props
 * @returns A React component that renders an autocomplete field
 */
export const AutocompleteFormElement = <
  TData extends MRT_RowData,
  TValue = unknown,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap['defaultComponent'],
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  {
    cell,
    table,
    options,
    multiple,
    required: aRequired,
    autocompleteProps,
    ...rest
  }: AutocompleteFormElementProps<TData, TValue, Multiple, DisableClearable, FreeSolo, ChipComponent, TFieldValues, TName>) => {
  const {column, row} = cell;
  const {columnDef} = column;
  // Transfer the text field props without overwriting the core component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {component, required, ...textFieldProps}: TextFieldProps = getTextFieldProps<TData, TValue>({
    cell,
    table,
    row,
    column
  });

  // Use type assertion to ensure the table type is preserved
  const typedTable = table as MRT_TableInstance<TData>;
  const typedCell = cell as MRT_Cell<TData, TValue>;

  return <AutocompleteElement
    options={options}
    multiple={multiple}
    name={column.id as TName}
    label={columnDef.header}
    textFieldProps={{
      ...textFieldProps,
      // Update material-react-table's editing row's cached value when focus is lost
      onBlur: (e) => {
        textFieldProps?.onBlur?.(e);
        updateEditingRow(typedTable, typedCell, e.target.value);
      }
    }}
    required={required || aRequired}
    autocompleteProps={autocompleteProps}
    {...rest}
  />;
};

AutocompleteFormElement.displayName = 'AutocompleteFormElement';