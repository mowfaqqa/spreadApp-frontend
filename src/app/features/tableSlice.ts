import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TableRow  = {
  [key: string]: string;
};

type TableState = {
  rows: TableRow[];
}

const initialState: TableState = {
  rows: [],
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    addRow: (state) => {
      state.rows.push({});
    },
    updateCell: (state, action: PayloadAction<{rowIndex: number; column: string; value: string }>) => {
      const { rowIndex, column, value } = action.payload;
      state.rows[rowIndex] = {...state.rows[rowIndex], [column]: value};
    }
  }
})

export const {addRow, updateCell} = tableSlice.actions;
export default tableSlice.reducer