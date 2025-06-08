import {MRT_RowData, MRT_TableInstance} from "material-react-table";
import {useFormContext, type FieldValues} from "react-hook-form-mui";
import {useMemo, useRef, useEffect} from "react";

/**
 * Props for the setCreatingRow function returned by useSetCreatingRow
 * @template TData - The row data type that extends MRT_RowData
 */
type useSetCreatingRowProps<TData extends MRT_RowData> = {
  table: MRT_TableInstance<TData>;
  emptyRowValues?: FieldValues;
}

/**
 * Hook to set the table in creating row mode.
 * @template TData - The row data type that extends MRT_RowData
 * @returns A function that sets the table in creating mode and resets the form with empty values
 *
 * @example
 * const setCreatingRow = useSetCreatingRow<T>();
 *
 * // Usage in an event handler
 * const handleCreate = () => {
 *   setCreatingRow({
 *     table,
 *     emptyRowValues: {
 *       // optional initial values
 *     }
 *   });
 * };
 */
export const useSetCreatingRow = <TData extends MRT_RowData>() => {
  const {reset, getValues} = useFormContext();
  const values = getValues();
  const prevKeysRef = useRef<string[]>([]);
  const emptyValuesRef = useRef({});
  const isCreatingRef = useRef(false);

  // Track the table instance to monitor state changes
  const tableRef = useRef<MRT_TableInstance<TData> | null>(null);

  // Compute empty values for form reset
  const emptyValues = useMemo(() => {
    const currentKeys = Object.keys(values);

    const keysChanged =
      prevKeysRef.current.length !== currentKeys.length ||
      currentKeys.some(key => !prevKeysRef.current.includes(key));

    if (keysChanged) {
      prevKeysRef.current = currentKeys;
      emptyValuesRef.current = Object.entries(values).reduce((previousValue, currentValue) => {
        const [key, value] = currentValue;
        let emptyValue: null | TData | TData[] | string | number = null;
        if (typeof value === 'string') {
          emptyValue = "";
        } else if (typeof value === 'number') {
          emptyValue = 0;
        } else if (Array.isArray(value)) {
          emptyValue = [];
        }
        previousValue[key] = emptyValue;
        return previousValue;
      }, {});
    }
    return emptyValuesRef.current;
  }, [values]);

  // Effect to reset form when creating state changes
  useEffect(() => {
    if (isCreatingRef.current && tableRef.current) {
      const {creatingRow} = tableRef.current.getState();
      if (creatingRow) {
        // The table state has been updated to creating mode
        reset(emptyValuesRef.current);
        isCreatingRef.current = false;
      }
    }
  }, [reset]);

  return ({table, emptyRowValues}: useSetCreatingRowProps<TData>) => {
    tableRef.current = table;
    isCreatingRef.current = true;

    // Set the creating row state in the table
    table.setCreatingRow(true);

    // Immediately reset with provided values, or wait for the effect if needed
    if (emptyRowValues) {
      reset(emptyRowValues);
    } else {
      // For synchronous reset attempt (works in most cases)
      reset(emptyValues);
    }
  };
};
