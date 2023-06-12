import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableRow {
  [column: string]: string;
}

interface Table {
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
    addRow: (state, action: PayloadAction<number>) => {
      const tableIndex = action.payload;
      state.tables[tableIndex].rows.push({});
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
    addColumn: (
      state,
      action: PayloadAction<{ tableIndex: number; column: string }>
    ) => {
      const { tableIndex, column } = action.payload;
      state.tables[tableIndex].columns.push(column);
      state.tables[tableIndex].rows.forEach((row) => {
        row[column] = '';
      });
    },
  },
});

export const { createTable, addRow, updateCell, addColumn } = tableSlice.actions;

export default tableSlice.reducer;
