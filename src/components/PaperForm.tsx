// src/components/PaperForm.tsx
import {Paper, type PaperProps} from "@mui/material";
import {FormContainer, type FieldValues, type FormContainerProps} from "react-hook-form-mui";
import {useEffect} from "react";
import {useFormContext} from "react-hook-form";
import {MRT_RowData, MRT_TableInstance} from "material-react-table";

/**
 * Props for the PaperForm component
 */
export type PaperFormProps<T extends FieldValues> = PaperProps & {
  formProps: FormContainerProps<T>;
  table?: MRT_TableInstance<T>;
};

/**
 * A component that combines a Material UI Paper with a form container
 *
 * PaperForm wraps form content in an elevated paper surface, providing
 * visual distinction and a clean container for form elements. It integrates
 * seamlessly with react-hook-form by using FormContainer internally.
 *
 * This component is useful for creating standalone form surfaces outside of dialogs,
 * such as on pages or within cards. It supports all Paper props for styling
 * while handling form state management through FormContainer.
 *
 * @example
 * // Basic usage
 * <PaperForm
 *   formProps={{
 *     defaultValues: { name: "", email: "" },
 *     onSuccess: handleSubmit
 *   }}
 *   elevation={3}
 * >
 *   <TextFieldElement name="name" label="Name" />
 *   <TextFieldElement name="email" label="Email" />
 *   <Button type="submit">Submit</Button>
 * </PaperForm>
 *
 * @template T - The type of form values being handled
 */
export const PaperForm = <T extends FieldValues>({children, table, formProps, ...paperProps}: PaperFormProps<T>) => (
  <Paper {...paperProps}>
    <FormContainer {...formProps}>
      <FormSync table={table}/>
        {children}
    </FormContainer>
  </Paper>
);

export type FormSyncProps<T extends MRT_RowData> = {
  table?: MRT_TableInstance<T>;
}
const FormSync = <T extends MRT_RowData>({table}: FormSyncProps<T>) => {
  useEffect(() => {
    console.log(table?.getState());
  }, [table]);

  const editingRow = table?.getState()?.editingRow;
  const context = useFormContext();
  useEffect(() => {
    if (editingRow) {
      context.reset(editingRow.original);
    }
  }, [context, editingRow]);
  return <></>
}

