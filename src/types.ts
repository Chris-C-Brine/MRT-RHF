import type {MRT_Cell, MRT_Column, MRT_Row, MRT_RowData, MRT_TableInstance} from "material-react-table";

export type EditFunctionProps<TData extends MRT_RowData, TValue = unknown> = {
  cell: MRT_Cell<TData, TValue>;
  column: MRT_Column<TData, TValue>;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}