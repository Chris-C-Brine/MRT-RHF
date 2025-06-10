import {MRT_RowData} from 'material-react-table';
import {AutocompleteElement, AutocompleteElementProps} from 'react-hook-form-mui';
import {updateEditingRow} from "../utils/updateEditingRow";
import {getTextFieldProps} from "../utils/getTextFieldProps";
import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps as BaseProps,
  AutocompleteValue,
  ChipTypeMap,
  TextFieldProps
} from "@mui/material";
import {ElementType, ReactNode, SyntheticEvent} from "react";
import {EditFunctionProps} from "../types";
import * as React from "react";

/**
 * Extended AutocompleteProps type that includes our custom properties
 */
export type AutocompleteProps<
  TValue,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
> = Omit<BaseProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'name' | 'options' | 'loading' | 'renderInput'>


/**
 * Props for the AutocompleteFormElement component
 *
 * @template TData - The data type for the table row
 * @template TValue - The value type for the autocomplete field
 * @template Multiple - Whether multiple selections are allowed
 * @template DisableClearable - Whether clearing the field is disabled
 * @template FreeSolo - Whether free text input is allowed
 */
export type AutocompleteFormElementProps<
  TData extends MRT_RowData,
  TValue = unknown,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends ElementType = ChipTypeMap['defaultComponent']
> =
  EditFunctionProps<TData, TValue>
  & Pick<AutocompleteElementProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'options' | 'multiple' | 'loading' | 'required' | 'rules' | 'showCheckbox' | 'loadingIndicator'>
  & {
    autocompleteProps?: AutocompleteProps<TValue, Multiple, DisableClearable, FreeSolo, ChipComponent>,
    transform?: {
      input?: (value: TValue) => AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>;
      output?: (event: SyntheticEvent, value: AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<TValue>) => TValue;
    }
};

/**
 * A form element that renders an Autocomplete field for Material React Table editing
 *
 * This component integrates react-hook-form-mui's AutocompleteElement with Material React Table's
 * editing functionality. It automatically handles form state and updates the table's editing row
 * when the field value changes.
 *
 * @template TData - The data type for the table row
 * @template TValue - The value type for the autocomplete field
 * @template Multiple - Whether multiple selections are allowed
 * @template DisableClearable - Whether clearing the field is disabled
 * @template FreeSolo - Whether free text input is allowed
 *
 * @example
 * // Basic usage
 * <AutocompleteFormElement {...props} options={["Option 1", "Option 2"]} />
 *
 * // With multiple selection
 * <AutocompleteFormElement {...props} options={options} multiple={true} />
 *
 * // With custom option rendering
 * <AutocompleteFormElement
 *   {...props as EditFunctionProps<UserType, HobbyObjectType>}
 *   options={complexOptions}
 *   autocompleteProps={{
 *     getOptionLabel: (option) => option.name
 *   }}
 * />
 *
 * @param props - The component props
 * @returns A React component that renders an autocomplete field
 */
export function AutocompleteFormElement<
  TData extends MRT_RowData,
  TValue,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>(
  props: AutocompleteFormElementProps<TData, TValue, Multiple, DisableClearable, FreeSolo>
): ReactNode {
  const {
    cell,
    table,
    column,
    row,
    options,
    multiple,
    required: aRequired,
    autocompleteProps,
    transform: customTransform,
    ...rest
  } = props;

  const {columnDef} = column;

  // Transfer the text field props without overwriting the core component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {component, required, ...textFieldProps}: TextFieldProps = getTextFieldProps({
    cell,
    table,
    row,
    column
  });

  // Calculate the field name from the column ID
  const fieldName = column.id;

  return (
    <AutocompleteElement
      name={fieldName}
      options={options}
      multiple={multiple}
      label={columnDef.header}
      textFieldProps={textFieldProps}
      required={required || aRequired}
      autocompleteProps={{
        ...autocompleteProps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onChange: (event, newValue, reason, details) => {
          autocompleteProps?.onChange?.(event, newValue, reason, details);
          updateEditingRow(table, cell, newValue)
        }
      }}
      transform={{
        input: (value: TValue): AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo> => {
          // Use custom transform if provided, otherwise return value as is
          if (customTransform?.input) return customTransform.input(value);
          return value as AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>;
        },
        output: (
          event: SyntheticEvent,
          value: AutocompleteValue<TValue, Multiple, DisableClearable, FreeSolo>,
          reason: AutocompleteChangeReason,
          details?: AutocompleteChangeDetails<TValue>
        ): TValue => {
          // Use custom transform if provided
          if (customTransform?.output) return customTransform.output(event, value, reason, details);

          // Default transform logic
          if (multiple && Array.isArray(value))
            return (value.map((i) => i as TValue)) as TValue;

          // For single selection, return the value as TValue
          return value as TValue;
        }
      }}
      {...rest}
    />
  );
}

AutocompleteFormElement.displayName = 'AutocompleteFormElement';
