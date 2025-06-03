import React, { useCallback, useEffect, useMemo } from 'react';
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

  const formContext = useForm<T>({
    defaultValues: editingRow?._valuesCache as DefaultValues<T>
  });

  const formProps = useMemo<PaperFormProps<T>['formProps']>(() => ({
    form: formContext,
    onSuccess: async (values) => {}, // Form validation only
  }), [formContext]);

  // Create a component that will be used as the Paper component in the dialog
  const getPaperFormComponent = useCallback(
    (table?: MRT_TableInstance<T>) =>
    (props: PaperProps) => (
      <PaperForm
        key={`form-${editingRow?.id || 'new'}`} // Force re-render when row changes
        formProps={formProps}
        table={table}
        {...props}
      />
    ),
    [formProps, editingRow?.id] // Re-create when formProps or editingRow.id changes
  );

  // Debug logging - only log when values actually change
  useEffect(() => {
    const subscription = formContext.watch((value) => {
      console.log('Form values:', value);
    });
    return () => subscription.unsubscribe();
  }, [formContext]);

  return {
    enableEditing: true,
    editDisplayMode: 'modal',
    ...props,
    onEditingRowSave: async (args) => {
      if (await formContext.trigger()) {
        alert("Valid")
        props?.onEditingRowSave?.(args);
      }
    },
    onEditingRowCancel: () => {
      formContext.reset();
    },
    muiEditRowDialogProps: (args) => {
      if (typeof args === 'object') {
        const Component = getPaperFormComponent(args.table);
        return injectDialogComponent(props?.muiEditRowDialogProps, Component);
      }
      return injectDialogComponent(props?.muiEditRowDialogProps, PaperForm);
    },
  };
}
