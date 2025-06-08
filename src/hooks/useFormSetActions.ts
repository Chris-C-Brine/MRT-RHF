import {MRT_RowData} from "material-react-table";
import {useSetEditingRow} from "./useSetEditingRow";
import {useSetCreatingRow} from "./useSetCreatingRow";

/**
 * Convenience hook that combines useSetEditingRow and useSetCreatingRow.
 * @template TData - The row data type that extends MRT_RowData
 * @returns An object containing setEditingRow and setCreatingRow functions
 *
 * @example
 * const { setEditingRow, setCreatingRow } = useFormSetActions<TData>();
 */
export const useFormSetActions = <TData extends MRT_RowData>() => {
  const setEditingRow = useSetEditingRow<TData>();
  const setCreatingRow = useSetCreatingRow<TData>();
  return {setEditingRow, setCreatingRow};
}