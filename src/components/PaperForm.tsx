// src/components/PaperForm.tsx
import {Paper, type PaperProps} from "@mui/material";
import {FormContainer, type FieldValues, type FormContainerProps} from "react-hook-form-mui";
import {useEffect, useRef, type PropsWithChildren} from "react";
import {useFormContext} from "react-hook-form";
import type {MRT_Row, MRT_RowData} from "material-react-table";

/**
 * Props for the PaperForm component
 */
export type PaperFormProps<T extends FieldValues> = PaperProps & {
  formProps: FormContainerProps<T>;
  editingRow?: MRT_Row<T> | null | undefined;
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
export const PaperForm = <T extends FieldValues>({children, editingRow, formProps, ...paperProps}: PaperFormProps<T>) => (
  <FormContainer {...formProps}>
    <FormSync editingRow={editingRow} paperProps={paperProps}>
      {children}
    </FormSync>
  </FormContainer>
);

export interface FormSyncProps<T extends MRT_RowData> extends PropsWithChildren, Pick<PaperFormProps<T>, 'editingRow'> {
  paperProps: Omit<PaperProps, 'children'>;
}
const FormSync = <T extends MRT_RowData>({editingRow, paperProps, children}: FormSyncProps<T>) => {
  const context = useFormContext();
  const prevEditingRowId = useRef<string | undefined>(undefined);

  // Only reset form when editingRow.id changes (new row selected)
  useEffect(() => {
    if (editingRow && editingRow.id !== prevEditingRowId.current) {
      prevEditingRowId.current = editingRow.id;
      // Use setTimeout to break the render cycle
      setTimeout(() => {
        context.reset(editingRow.original);
      }, 0);
    }
  }, [editingRow]);

  return <Paper {...paperProps}>{children}</Paper>;
}
