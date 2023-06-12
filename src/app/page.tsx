"use client";
import { Provider } from "react-redux";
import React from "react";
import Table from "./components/TableComponent/Table";
import store from "./store";

export default function Home() {
  const columns = [""];
  return (
    <Provider store={store}>
      <Table initialColumns={columns} />
    </Provider>
  );
}
