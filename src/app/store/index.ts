import { configureStore } from "@reduxjs/toolkit";
import tableReducer from '../features/tableSlice'

const initialColumns = ['Date', 'Customer name', 'item sold', 'Quantity', 'Unit price']
const store = configureStore({
  reducer: {
    table: tableReducer,
  },
  preloadedState: {
    table: {
      tables: [
        {
          name: "Spreadsheet 1",
          columns: initialColumns,
          rows: []
        }
      ]
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export default store