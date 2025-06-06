import {useEffect, createContext, useContext,  useState, type PropsWithChildren} from "react";
import {useForm, type FieldValues,  FormContainer} from "react-hook-form-mui";
import {MRT_Row} from "material-react-table";
import {DefaultValues} from "react-hook-form";

export interface FormTableContextValue<T extends FieldValues = FieldValues> {
  editingRow: MRT_Row<T> | null;
  setEditingRow: (row: MRT_Row<T> | null) => void;
}

const FormTableContext = createContext<FormTableContextValue<any> | undefined>(undefined);

/**
 * Access the typed table form context.
 * Usage: const { editingRow, setEditingRow, form } = useFormTableContext<YourDataType>();
 */
export function useFormTableContext<T extends FieldValues>() {
  const ctx = useContext(FormTableContext);
  if (!ctx) {
    throw new Error('useFormTableContext must be used within a FormTableProvider');
  }
  return ctx as FormTableContextValue<T>;
}

/**
 * Provider with generic parameter for strong typing.
 * Place <FormTableProvider<YourRowType>><YourTable /></FormTableProvider> at a high level.
 */
export function FormTableProvider<T extends FieldValues>({children}: PropsWithChildren) {
  const [editingRow, setEditingRow] = useState<MRT_Row<T> | null>(null);

  const formContext = useForm<T>({
    defaultValues: editingRow?.original as DefaultValues<T>,
  });
  const {reset} = formContext;

  // When editingRow changes, reset the form default values
  useEffect(() => {
    if (editingRow?.original) {
      reset(editingRow.original);
    } else {
      reset();
    }
  }, [editingRow?.original, reset]);

  return (
    <FormContainer formContext={formContext}>
      <FormTableContext.Provider value={{editingRow, setEditingRow}}>
        {children}
      </FormTableContext.Provider>
    </FormContainer>
  );
}