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
        table.rows.push({})
      } 
    },
    updateCell: (
      state,
      action: PayloadAction<{
        tableId: string;
        rowIndex: number;
        column: string;
        value: string;
      }>
    ) => {
      const { tableId, rowIndex, column, value } = action.payload;
      const table = state.tables.find((table) => table.id  === tableId);
      if (table) {
        table.rows[rowIndex][column] = value
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
        })
      }
    },
    deleteColumn: (
      state,
      action: PayloadAction<{tableId: string; columnIndex: number}>
    ) => {
      const { tableId, columnIndex } = action.payload;
      const table = state.tables.find((table) => table.id === tableId);
      if (table) {
        const columnToDelete = table.columns[columnIndex];
        table.columns.splice(columnIndex, 1);
        table.rows.forEach((row) => {
          delete row[columnToDelete]
        })
      }
    }
  },
});

export const {
  createTable,
  deleteTable,
  addRow,
  updateCell,
  addColumn,
  deleteColumn,
} = tableSlice.actions;

export default tableSlice.reducer;
