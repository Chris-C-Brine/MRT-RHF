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
- **Material React Table** \- A feature-rich table library built on MUI v5
- **React Hook Form** \- A performant, flexible form validation library

## Example

```tsx
// src/pages/DemoPage/components/DemoTable.tsx
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
import getDemoTableColumns from "./getDemoTableColumns";


const InnerDemoTable = memo(() => {
  const { setEditingRow, setCreatingRow } = useFormSetActions<UserType>();
  const aboutTableColumns = getDemoTableColumns();

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
    [setCreatingRow, setEditingRow, aboutTableColumns, /*, ...other config dependencies */],
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
```tsx
// src/pages/DemoPage/components/getAboutTableColumns.tsx
import { birthdayCheck, calculateAge } from "@utils";
import dayjs from "dayjs";
import type { MRT_ColumnDef } from "material-react-table";
import { hobbies, hobbyObjects, HobbyType } from "./hobbies";
import { MRT_EditCellDatePicker } from "@chris-c-brine/mrt-ui-kit";
import { MuiIcon } from "@src/components";
import type { UserType } from "../aboutTypes";
import { Chip } from "@mui/material";
import {AutocompleteFormElement, TextFormElement, type EditFunctionProps} from "@chris-c-brine/mrt-rhf";

const getDemoTableColumns = (): MRT_ColumnDef<UserType>[] => [
  {
    columnDefType: "display", // Hide from Edit/Create/View Dialogs
    header: "ID",
    accessorKey: "id",

    // Note: The option will still appear in the column visibility toggle menu
    enableHiding: false, // Don't allow it's hiding state to be altered

    // Hide from the column visibility toggle menu
    visibleInShowHideMenu: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    enableGrouping: false,
    enableClickToCopy: true,
    Edit: TextFormElement,
    muiEditTextFieldProps: {
      size: "medium",
      variant: "standard",
      required: true,
      fullWidth: true,
      slotProps: {
        inputLabel: { shrink: true },
      },
    },
  },
  {
    header: "DOB",
    accessorKey: "dob",
    Cell: ({ cell }: EditFunctionProps<UserType>) => {
      const dob = cell.getValue<string>();
      return (
        <>
          {dayjs(dob).format("MM/DD/YYYY")}
          {birthdayCheck(dob) && <MuiIcon sx={{ ml: 2 }} muiName="CakeIcon" />}
        </>
      );
    },
    enableEditing: false,

    Edit: ({ table, cell }: EditFunctionProps<UserType>) => {
      return <MRT_EditCellDatePicker table={table} cell={cell} showLabel />;
    },
  },
  {
    header: "Hobbies",
    accessorKey: "hobbies",
    filterVariant: "select",
    filterSelectOptions: [...hobbies],
    Cell: ({ cell }) => {
      const cValue = cell.getValue<string[] | string>();
      if (Array.isArray(cValue)) return cValue?.map((i: string) => <Chip label={i} key={i} />);
      return cValue;
    },
    Edit: (props: EditFunctionProps<UserType>) => (
      <AutocompleteFormElement
        {...props}
        options={[...hobbies]}
        multiple={true}
        autocompleteProps={{
          slotProps: {
            chip: { size: "small" }, // Conforms to medium height input
          },
        }}
      />
    ),
  },
  {
    header: "Hobby Object",
    accessorKey: "hobbyId",
    filterVariant: "select",
    filterSelectOptions: hobbyObjects.map((i) => i.name),
    filterFn: (row, id, filterValue) => row.getValue<HobbyType>(id).name == filterValue,
    Cell: ({ cell }) => {
      const id = cell.getValue<number>();
      return hobbyObjects.find((i) => i.id == id)?.name;
    },
    Edit: (props: EditFunctionProps<UserType>) => (
      <AutocompleteFormElement
        {...props as EditFunctionProps<UserType, number>}
        options={hobbyObjects}
        autocompleteProps={{
          getOptionLabel: (i) =>
            typeof i == "number" ? (hobbyObjects.find((h) => h.id == i)?.name ?? "") : i.name,
          getOptionKey: (i) => (typeof i == "number" ? i : i.id),
          slotProps: {
            chip: { size: "small" }, // Conforms to medium height input
          },
        }}
        transform={{
          output: (_, i) => i.id,
        }}
      />
    ),
  },
  {
    header: "Age",
    id: "age",
    accessorFn: ({ dob }) => {
      const { years, months, days } = calculateAge(dob);
      return `${years} years, ${months} months, and ${days} days old`;
    },
    enableGrouping: false,
    enableEditing: false,
    Edit: () => null,
  },
];

export default getDemoTableColumns;
```
```ts
// src/pages/DemoPage/components/hobbies.ts
export const hobbies = ['Coding', 'Music', 'Reading', 'Learning'] as const;
export type HobbyType = {
  id: number;
  name: typeof hobbies[number];
}

export const hobbyObjects = hobbies.map<HobbyType>((i, k) => ({ id: k + 1, name: i }));
```

## License


[AAL](LICENSE) © Christopher C. Brine
