import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TableRow = {
  [key: string]: string;
};

type TableState = {
  columns: string[];
  rows: TableRow[];
};

const initialState: TableState = {
  columns: [],
  rows: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<string>) => {
      state.columns.push(action.payload);
      state.rows.forEach((row) => {
        row[action.payload] = '';
      });
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      const columnToRemove = action.payload;
      state.columns = state.columns.filter((column) => column !== columnToRemove);
      state.rows.forEach((row) => {
        delete row[columnToRemove];
      });
    },
    addRow: (state) => {
      const newRow: TableRow = {};
      state.columns.forEach((column) => {
        newRow[column] = '';
      });
      state.rows.push(newRow);
    },
    updateCell: (
      state,
      action: PayloadAction<{ rowIndex: number; column: string; value: string }>
    ) => {
      const { rowIndex, column, value } = action.payload;
      state.rows[rowIndex][column] = value;
    },
  },
});

export const { addColumn, removeColumn, addRow, updateCell } = tableSlice.actions;
export default tableSlice.reducer;
