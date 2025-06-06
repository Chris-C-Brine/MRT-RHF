import {MRT_RowData, MRT_TableInstance, MRT_TableOptions, useMaterialReactTable} from "material-react-table";
import {useFormContext} from "react-hook-form-mui";
import {useFormTableContext} from "../state/FormTableProvider";

export const useRHFMaterialReactTable = <T extends MRT_RowData>(tableOptions: MRT_TableOptions<T>): MRT_TableInstance<T> => {

  const {trigger, reset} =  useFormContext();
  const {setEditingRow} = useFormTableContext<T>();

  // Validation Enforcement: Editing
  tableOptions.onEditingRowSave = async (props)=> {
    if (await trigger()) tableOptions.onEditingRowSave?.(props);
  }

  // Validation Enforcement: Creating
  tableOptions.onCreatingRowSave = async (props)=> {
    if (await trigger()) tableOptions.onCreatingRowSave?.(props);
  }

  // Close and clear editing row values
  tableOptions.onEditingRowCancel = (props) => {
    setEditingRow(null);
    reset();
  }

  return useMaterialReactTable(tableOptions);
}