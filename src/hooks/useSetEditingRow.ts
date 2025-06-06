import {MRT_Row, MRT_RowData, MRT_TableInstance} from "material-react-table";
import {useFormTableContext} from "../state/FormTableProvider";

type useSetEditingRowProps<T extends MRT_RowData> = {
  table: MRT_TableInstance<T>;
  row: MRT_Row<T> | null;
}

export const useSetEditingRow = <T extends MRT_RowData>() => {
  const {setEditingRow} = useFormTableContext<T>();

  return ({table, row}: useSetEditingRowProps<T>) => {
    table.setEditingRow(row);
    setEditingRow(row ?? null);
  }
}