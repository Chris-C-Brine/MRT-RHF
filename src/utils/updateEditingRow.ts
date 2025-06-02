
import {
  MRT_TableInstance,
  MRT_Cell,
  MRT_RowData,
} from 'material-react-table';

/**
 * Updates the editing row in a Material React Table with a new value
 *
 * This utility function is used by editing components to update the value
 * in the row's cache and handle save operations for cell editing mode.
 *
 * @template TData - The data type for the table row
 * @param table - The Material React Table instance
 * @param cell - The cell being edited
 * @param newValue - The new value to set (can be any type, including Dayjs objects)
 */
export const updateEditingRow = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  cell: MRT_Cell<TData>,
  newValue: unknown
) => {
  const {editingRow, creatingRow} = table.getState();
  const {row} = cell;

  //@ts-expect-error row._valuesCache is keyed by column.id
  row._valuesCache[cell.column.id] = newValue;
  console.log(row._valuesCache);

  if (editingRow?.id) {
    table.setEditingRow(row);
    if (table.options.editDisplayMode === 'cell') {
      void table.options?.onEditingRowSave?.({
        table,
        row,
        values: row._valuesCache,
        exitEditingMode: () => table.setEditingCell(null),
      });
    }
  } else if (creatingRow?.id) {
    table.setCreatingRow(row);
  }
};