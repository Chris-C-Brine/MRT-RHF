import type {MRT_Cell, MRT_Column, MRT_Row, MRT_RowData, MRT_TableInstance} from "material-react-table";

/**
 * Props shared by all editing components for Material React Table integration
 *
 * This interface provides the core properties needed for any component that
 * participates in the Material React Table editing workflow, giving access to
 * the cell being edited, its column, the row, and the table instance.
 *
 * @template TData - The data type for the table row
 * @template TValue - The value type for the cell (defaults to unknown)
 */
export type EditFunctionProps<TData extends MRT_RowData, TValue = unknown> = {
  /** The cell being edited */
  cell: MRT_Cell<TData, TValue>;
  /** The column definition for the cell */
  column: MRT_Column<TData, TValue>;
  /** The row containing the cell */
  row: MRT_Row<TData>;
  /** The Material React Table instance */
  table: MRT_TableInstance<TData>;
}