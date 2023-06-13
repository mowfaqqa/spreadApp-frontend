import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Table {
  _id: string;
  name: string;
  columns: string[];
  rows: Record<string, string>[];
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
    deleteTable: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload;
      state.tables = state.tables.filter((table) => table._id !== tableId);
    },
    addRow: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload;
      const table = state.tables.find((table) => table._id === tableId);
      if (table) {
        const newRow: Record<string, string> = {};
        table.columns.forEach((column) => {
          newRow[column] = '';
        });
        table.rows.push(newRow);
      }
    },
    addColumn: (state, action: PayloadAction<{ tableId: string; columnName: string }>) => {
      const { tableId, columnName } = action.payload;
      const table = state.tables.find((table) => table._id === tableId);
      if (table) {
        table.columns.push(columnName);
        table.rows.forEach((row) => {
          row[columnName] = '';
        });
      }
    },
    updateCellValue: (
      state,
      action: PayloadAction<{ tableId: string; rowIndex: number; columnName: string; value: string }>
    ) => {
      const { tableId, rowIndex, columnName, value } = action.payload;
      const table = state.tables.find((table) => table._id === tableId);
      if (table) {
        table.rows[rowIndex][columnName] = value;
      }
    },
    deleteColumn: (state, action: PayloadAction<{ tableId: string; columnName: string }>) => {
      const { tableId, columnName } = action.payload;
      const table = state.tables.find((table) => table._id === tableId);
      if (table) {
        const columnIndex = table.columns.indexOf(columnName);
        if (columnIndex !== -1) {
          table.columns.splice(columnIndex, 1);
          table.rows.forEach((row) => {
            delete row[columnName];
          });
        }
      }
    },
  },
});

export const { createTable, deleteTable, addRow, addColumn, updateCellValue, deleteColumn } =
  tableSlice.actions;

export default tableSlice.reducer;
