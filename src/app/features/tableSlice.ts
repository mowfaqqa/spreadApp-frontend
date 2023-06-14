import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableRow {
  [column: string]: string;
}

interface Table {
  id: string;
  name: string;
  columns: string[];
  rows: TableRow[];
}

interface TableState {
  tables: Table[];
}

const initialState: TableState = {
  tables: [],
};


const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    createTable: (state, action: PayloadAction<Table>) => {
      state.tables.push(action.payload);
    },
    deleteTable: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      state.tables = state.tables.filter((table) => table.id !== tableId);
    },
    addRow: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      const table = state.tables.find((table) => table.id === tableId);
      if (table) {
        table.rows.push({});
      }
    },
    addColumn: (
      state,
      action: PayloadAction<{ tableId: string; column: string }>
    ) => {
      const { tableId, column } = action.payload;
      const table = state.tables.find((table) => table.id === tableId);
      if (table) {
        table.columns.push(column);
        table.rows.forEach((row) => {
          row[column] = '';
        });
      }
    },
    updateCell: (
      state,
      action: PayloadAction<{
        tableIndex: number;
        rowIndex: number;
        column: string;
        value: string;
      }>
    ) => {
      const { tableIndex, rowIndex, column, value } = action.payload;
      state.tables[tableIndex].rows[rowIndex][column] = value;
    },
    deleteColumn: (
      state,
      action: PayloadAction<{ tableId: string; columnIndex: number }>
    ) => {
      const { tableId, columnIndex } = action.payload;
      const table = state.tables.find((table) => table.id === tableId);
      if (table) {
        const columnToDelete = table.columns[columnIndex];
        table.columns.splice(columnIndex, 1);
        table.rows.forEach((row) => {
          delete row[columnToDelete];
        });
      }
    },
    loadTables: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },
  },
});

export const {  
  createTable,
  deleteTable,
  addRow,
  updateCell,
  addColumn,
  deleteColumn,  } =
  tableSlice.actions;

export default tableSlice.reducer;