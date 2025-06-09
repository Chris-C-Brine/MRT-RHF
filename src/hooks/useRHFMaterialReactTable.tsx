import {MRT_RowData, MRT_TableInstance, MRT_TableOptions, useMaterialReactTable} from "material-react-table";
import {useFormContext} from "react-hook-form-mui";
import {useFormTableContext} from "../state/FormTableProvider";
import {useCallback, useMemo} from "react";

/**
 * Hook that integrates Material React Table with React Hook Form.
 * @template T - The row data type that extends MRT_RowData
 * @param tableOptions - The options for the Material React Table
 * @returns A table instance with form integration
 *
 * @example
 * const tableConfig = useMemo<MRT_TableOptions<T>>(() => ({
 *   // table configuration
 * }), [dependencies]);
 *
 * const table = useRHFMaterialReactTable(tableConfig);
 */
export const useRHFMaterialReactTable = <T extends MRT_RowData>(tableOptions: MRT_TableOptions<T>): MRT_TableInstance<T> => {
  const {trigger} = useFormContext<T>();
  const {editingRow, creatingRow} = useFormTableContext<T>();

  const createExitEditingCallback = useCallback((exitEditingMode: () => void) => {
    return () => {
      editingRow.current = null;
      exitEditingMode();
    };
  }, [editingRow]);

  const createExitCreatingCallback = useCallback((exitCreatingMode: () => void) => {
    return () => {
      creatingRow.current = false;
      exitCreatingMode();
    };
  }, [creatingRow]);

  const memoizedOptions = useMemo<MRT_TableOptions<T>>(() => ({
    ...tableOptions,
    // Validation Enforcement: Editing
    onEditingRowSave: async ({exitEditingMode, ...props}) => {
      const exit = createExitEditingCallback(exitEditingMode);

      if (await trigger()) {
        tableOptions.onEditingRowSave?.({...props, exitEditingMode: exit});
      }
    },
    // Validation Enforcement: Creating
    onCreatingRowSave: async ({exitCreatingMode, ...props}) => {
      const exit = createExitCreatingCallback(exitCreatingMode);

      if (await trigger()) tableOptions.onCreatingRowSave?.({...props, exitCreatingMode: exit});
    },
    // Close and clear editing row
    onEditingRowCancel: (props) => {
      editingRow.current = null;
      tableOptions.onEditingRowCancel?.(props);
    },
    // Close and clear editing row
    onCreatingRowCancel: (props) => {
      creatingRow.current = false;
      tableOptions.onCreatingRowCancel?.(props);
    },
  }), [tableOptions, createExitEditingCallback, createExitCreatingCallback]);

  return useMaterialReactTable(memoizedOptions);
}