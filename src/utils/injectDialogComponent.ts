// src/utils/injectDialogComponent.ts
import { DialogProps } from '@mui/material';
import {MRT_Row, MRT_RowData, MRT_TableInstance} from 'material-react-table';
import type { ElementType } from 'react';

export type DialogPropsOrFn<T extends MRT_RowData> =
  | DialogProps
  | ((props: { row: MRT_Row<T>; table: MRT_TableInstance<T> }) => DialogProps)
  | undefined;

/**
 * Ensures slotProps.paper.component is injected into the dialog props.
 */
export function injectDialogComponent<T extends MRT_RowData>(
  original: DialogPropsOrFn<T> | undefined,
  component: ElementType
): DialogPropsOrFn<T> {
  if (typeof original === 'function' || original === undefined) {
    return (args: { row: MRT_Row<T>; table: MRT_TableInstance<T> }) => {
      const base = original?.(args) ?? {open: true, slotProps: { paper: { component }}};
      return {
        ...base,
        slotProps: {
          ...base?.slotProps,
          paper: {
            ...base?.slotProps?.paper ?? {},
            component,
          },
        },
      };
    };
  }

  return {
    ...original,
    slotProps: {
      ...original?.slotProps,
      paper: {
        ...original?.slotProps?.paper ?? {},
        component,
      },
    },
  } as DialogProps;
}