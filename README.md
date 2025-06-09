# @Chris-C-Brine/MRT-RHF
[![npm version](https://img.shields.io/npm/v/@chris-c-brine/mrt-rhf.svg)](https://www.npmjs.com/package/@chris-c-brine/mrt-rhf)
[![License: AAL](https://img.shields.io/badge/License-AAL-blue.svg)](https://github.com/Chris-C-Brine/mrt-rhf/blob/main/LICENSE)

## Installation
```bash
  npm install @chris-c-brine/mrt-rhf
```

### Peer Dependencies
This package requires the following peer dependencies:

```shell script
  npm i react react-dom material-react-table @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled react-hook-form react-hook-form-mui
```

## Project Purpose
This library (`@chris-c-brine/mrt-rhf`) simplifies the integration between:
- **Material React Table** - A feature-rich table library built on MUI v5
- **React Hook Form** - A performant, flexible form validation library

## Example

```tsx
import { MRT_EditDialog, setViewingRow } from "@chris-c-brine/mrt-ui-kit";
import { MaterialReactTable, type MRT_TableOptions } from "material-react-table";
import { memo, useMemo } from "react";
import { UserType } from "@pages/AboutPage/aboutTypes";
import {
  useRHFMaterialReactTable,
  useFormSetActions,
  useFormTableContext,
  FormTableProvider
} from "@chris-c-brine/mrt-rhf";
import { Box, IconButton } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import  aboutTableData from "./aboutTableData";
import aboutTableColumns from "./aboutTableColumns";

const InnerDemoTable = memo(() => {
  const { setEditingRow, setCreatingRow } = useFormSetActions<UserType>();

  const tableConfig = useMemo<MRT_TableOptions<UserType>>(
    () => ({
      data: aboutTableData,
      columns: aboutTableColumns,
      enableEditing: true,
      renderRowActions: ({ table, row }) => {
        const { editingRow } = useFormTableContext<UserType>();
        return (
          <>
            <IconButton onClick={() => setViewingRow({ table, row })}>
              <VisibilityIcon />
            </IconButton>
            <IconButton
              // Disable when a row is updating on a single mutation instance
              disabled={!!editingRow?.current?.id} // mutation.isFetching
              loading={editingRow?.current?.id == row.id} // mutation?.variables?.id == row.id
              onClick={() => setEditingRow({ table, row })}
            >
              <EditIcon />
            </IconButton>
            {/* Delete Button / Confirmation Dialog */}
          </>
        );
      },
      renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
        <MRT_EditDialog
          table={table}
          row={row}
          components={internalEditComponents}
          columnWidths={[{ sm: 4, xs: 12 }, { sm: 4, xs: 12 }, { sm: 4, xs: 12 }, { xs: 12 }]}
          rowGap={2}
          renderViewComponent={({ title, renderedComponent }) => {
            return (
              <>
                {title}: {renderedComponent}
              </>
            );
          }}
        />
      ),
      muiEditRowDialogProps: {
        open: true,
        maxWidth: "md", // Max width by breakpoint
        // slotProps:{
        //   paper: {
        //     sx: { maxWidth: 500 } // Max width in px
        //   }
        // }
      },
      onCreatingRowSave: ({ exitCreatingMode, values }) => {
        console.log({ values });
        exitCreatingMode();
      },
      onEditingRowSave: ({ exitEditingMode, values }) => {
        console.log({ values });
        exitEditingMode();
      },
      renderTopToolbarCustomActions: ({ table }) => (
        <Box>
          <IconButton onClick={() => { /* Re-query table data */ }}>
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={() => setCreatingRow({ table })}>
            <AddIcon />
          </IconButton>
        </Box>
      ),
      // ... Other configs
    }),
    [setCreatingRow, setEditingRow/*, ...other config dependencies */],
  );

  const table = useRHFMaterialReactTable(tableConfig);
  return <MaterialReactTable table={table} />;
});

InnerDemoTable.displayName = "InnerDemoTable";

const DemoTable = () => (
  <FormTableProvider><InnerDemoTable/></FormTableProvider>
)

export default DemoTable;
```

## License

[AAL](LICENSE) © Christopher C. Brine
