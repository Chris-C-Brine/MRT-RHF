import {useEffect, createContext, useContext, useState, type PropsWithChildren, useRef, RefObject} from "react";
import {useForm, type FieldValues,  FormContainer} from "react-hook-form-mui";
import {MRT_Row} from "material-react-table";
import {DefaultValues} from "react-hook-form";

/**
 * The value provided by FormTableContext
 * @template T - The row data type that extends FieldValues
 */
export interface FormTableContextValue<T extends FieldValues = FieldValues> {
  editingRow: RefObject<MRT_Row<T> | null>;
  creatingRow: RefObject<boolean>;
}

const FormTableContext = createContext<FormTableContextValue<any> | undefined>(undefined);

/**
 * Hook to access the form table context.
 * @template T - The row data type that extends FieldValues
 * @returns The form table context value
 *
 * @example
 * const { editingRow, creatingRow } = useFormTableContext<T>();
 */
export function useFormTableContext<T extends FieldValues>() {
  const contextValue = useContext(FormTableContext);
  if (!contextValue) {
    throw new Error('useFormTableContext must be used within a FormTableProvider');
  }
  return contextValue as FormTableContextValue<T>;
}

/**
 * Provider component that creates a context for form-enabled tables.
 * @template T - The row data type that extends FieldValues
 *
 * @example
 * <FormTableProvider>
 *   <YourMaterialReactTable />
 * </FormTableProvider>
 *
 * @param props - The component props
 * @param props.children - The child components that will have access to the form table context
 */
export function FormTableProvider<T extends FieldValues>({children}: PropsWithChildren) {
  const editingRow = useRef<MRT_Row<T> | null>(null);
  const creatingRow = useRef<boolean>(false);

  const formContext = useForm<T>({
    defaultValues: editingRow.current?.original as DefaultValues<T>,
  });

  return (
    <FormContainer formContext={formContext}>
      <FormTableContext.Provider value={{editingRow, creatingRow}}>
        {children}
      </FormTableContext.Provider>
    </FormContainer>
  );
}