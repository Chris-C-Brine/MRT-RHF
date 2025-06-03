import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import type {MRT_RowData, MRT_TableInstance, MRT_TableOptions} from 'material-react-table';
import { PaperForm, type PaperFormProps } from '../components/PaperForm';
import type { PaperProps} from '@mui/material';
import { injectDialogComponent } from '../utils/injectDialogComponent';
import {DefaultValues, useForm} from 'react-hook-form';

export interface UseFormTableProps<T extends MRT_RowData>
  extends Omit<MRT_TableOptions<T>, 'editDisplayMode'> {}

export function useReactHookFormDialog<T extends MRT_RowData>(
  props: UseFormTableProps<T>
): MRT_TableOptions<T> {
  const editingRow = props.state?.editingRow;
  const previousEditingRowId = useRef<string | undefined>(editingRow?.id);

  const formContext = useForm<T>({
    defaultValues: {} as DefaultValues<T> // Note: this is set in PaperForm
  });

  // Reset form when editing row changes
  useEffect(() => {
    if (editingRow && editingRow.id !== previousEditingRowId.current) {
      previousEditingRowId.current = editingRow.id;
      formContext.reset(editingRow._valuesCache as DefaultValues<T>);
    }
  }, [editingRow?.id, formContext]);


  const formProps = useMemo<PaperFormProps<T>['formProps']>(() => ({
    form: formContext,
    onSuccess: () => {}, // RHF is only used for validation
  }), [formContext]);

  // Create a component that will be used as the Paper component in the dialog
  const getPaperFormComponent = useCallback(
    (editingRow?: PaperFormProps<T>["editingRow"]) =>
    (props: PaperProps) => (
      <PaperForm
        key={`form-${editingRow?.id || 'new'}`} // Force re-render when row changes
        formProps={formProps}
        editingRow={editingRow}
        {...props}
      />
    ),
    [formProps, editingRow?.id] // Re-create when formProps or editingRow.id changes
  );

  return {
    enableEditing: true,
    editDisplayMode: 'modal',
    ...props,
    onEditingRowSave: async (args) => {
      // Ensure we use the current form values directly from the form context
      if (await formContext.trigger()) {
        console.error('Valid!', formContext.getValues());

        // Call the original onEditingRowSave to handle normal form submission
        props?.onEditingRowSave?.(args);
      }
    },

    onEditingRowCancel: () => {
      formContext.reset();
      previousEditingRowId.current = undefined;
    },
    muiEditRowDialogProps: (args) => {
      if (typeof args === 'object') {
        const Component = getPaperFormComponent(args.table.getState().editingRow);
        return injectDialogComponent(props?.muiEditRowDialogProps, Component);
      }
      return injectDialogComponent(props?.muiEditRowDialogProps, PaperForm);
    },
  };
}
