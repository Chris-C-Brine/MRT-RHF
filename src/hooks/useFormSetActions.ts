import {MRT_RowData} from "material-react-table";
import {useSetEditingRow} from "./useSetEditingRow";
import {useSetCreatingRow} from "./useSetCreatingRow";

export const useFormSetActions = <T extends MRT_RowData>() => {
  const setEditingRow = useSetEditingRow<T>();
  const setCreatingRow = useSetCreatingRow<T>();
  return {setEditingRow, setCreatingRow};
}