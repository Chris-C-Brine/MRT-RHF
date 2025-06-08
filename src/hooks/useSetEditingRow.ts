// src/hooks/useSetEditingRow.ts
import {MRT_Row, MRT_RowData, MRT_TableInstance} from "material-react-table";
import {useFormTableContext} from "../state/FormTableProvider";
import {useFormContext} from "react-hook-form-mui";

/**
 * Props for the setEditingRow function returned by useSetEditingRow
 * @template T - The row data type that extends MRT_RowData
 */
type useSetEditingRowProps<T extends MRT_RowData> = {
  table: MRT_TableInstance<T>;
  row: MRT_Row<T> | null;
}

/**
 * Hook to set the currently editing row in the table.
 * @template T - The row data type that extends MRT_RowData
 * @returns A function that sets the editing row and resets the form with the row's original values
 *
 * @example
 * const setEditingRow = useSetEditingRow<T>();
 *
 * // Usage in an event handler
 * const handleEdit = (row: MRT_Row<T>) => {
 *   setEditingRow({ table, row });
 * };
 */
export const useSetEditingRow = <T extends MRT_RowData>() => {
  const {editingRow} = useFormTableContext<T>();
  const {reset} = useFormContext(); // Add this to access form methods

  return ({table, row}: useSetEditingRowProps<T>) => {
    table.setEditingRow(row);
    editingRow.current = row;

    // Reset form when a new row is selected for editing
    if (row?.original) reset(row.original);
  }
}