import React, { useCallback, useEffect, useMemo } from 'react';
import type { MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { PaperForm, type PaperFormProps } from '../components/PaperForm';
import type { PaperProps } from '@mui/material';
import { injectDialogComponent } from '../utils/injectDialogComponent';
import {DefaultValues, useForm} from 'react-hook-form';

export interface UseFormTableProps<T extends MRT_RowData>
  extends Omit<MRT_TableOptions<T>, 'editDisplayMode'> {}

export function useReactHookFormDialog<T extends MRT_RowData>(
  props: UseFormTableProps<T>
): MRT_TableOptions<T> {
  const editingRow = props.state?.editingRow;

  const formContext = useForm<T>({
    defaultValues: editingRow?._valuesCache as DefaultValues<T>,
    // mode: 'onChange',
  });



  const formProps = useMemo<PaperFormProps<T>['formProps']>(() => ({
    form: formContext,
    onSuccess: async (values) => {
      // API call here with updated values
      
    },
  }), [formContext]);

  const PaperFormComponent = useCallback(
    (paperProps: PaperProps) => (
      <PaperForm formProps={formProps} {...paperProps} />
    ),
    [formProps]
  );

  useEffect(() => console.log(formContext.getValues()), [formContext]);

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
    onEditingRowChange: (current) => {
      console.log({"current editing row": current});
      if (current != null) {
        formContext.reset(!current ? current : undefined);
      }
      return current;
    },
    onEditingRowCancel: () => {
      formContext.reset();
    },
    muiEditRowDialogProps: injectDialogComponent(props?.muiEditRowDialogProps, PaperFormComponent),
  };
}
