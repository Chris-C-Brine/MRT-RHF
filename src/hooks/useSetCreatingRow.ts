import {MRT_RowData, MRT_TableInstance} from "material-react-table";
import {useFormContext, type FieldValues} from "react-hook-form-mui";
import {useMemo} from "react";

type useSetCreatingRowProps<T extends MRT_RowData> = {
  table: MRT_TableInstance<T>;
}

export const useSetCreatingRow = <T extends MRT_RowData>() => {
  const {reset, getValues} = useFormContext();

  const values = getValues();

  const emptyValues = useMemo(() => {
    return Object.entries(values).reduce((previousValue, currentValue) => {
      const [key, value] = currentValue;

      // Object | Array | String
      let emptyValue: null | [] | "" = null;

      if (typeof value === 'string') {
        emptyValue = "";
      } else if (Array.isArray(value)) {
        emptyValue = [];
      }

      previousValue[key] = emptyValue;
      return previousValue;
    }, {} as FieldValues)
  }, [Object.keys(values).length]);

  return ({table}: useSetCreatingRowProps<T>) => {
    table.setCreatingRow(true);
    reset(emptyValues);
  }
}