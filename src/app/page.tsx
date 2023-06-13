"use client";
import { Provider } from "react-redux";
import React from "react";
import Table from "./components/TableComponent/Table";
import store from "./store";

export default function Home() {
  const columns = ["Date", "Customer Name", "Items Sold", "Quantity", "Unit"];
  return (
    <Provider store={store}>
      <Table />
    </Provider>
  );
}
