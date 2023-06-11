"use client";
import { Provider } from "react-redux";
import React from "react";
import Table from "./components/TableComponent/Table";
import store from "./store";

export default function Home() {
  const columns = ["Column 1", "Column 2", "Column 3", "Column 4", "column 5"];
  return (
    <Provider store={store}>
      <Table columns={columns} />
    </Provider>
  );
}
