import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTable,
  deleteTable,
  addRow,
  addColumn,
  updateCellValue,
  deleteColumn,
} from "../../features/tableSlice";
import { RootState } from "../../store";
import axios from "axios";
import { Plus, Trash } from "react-feather";

interface Table {
  _id: string;
  name: string;
  columns: string[];
  rows: Record<string, string>[];
}
const Table: React.FC = () => {
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.table.tables);
  const [newTableName, setNewTableName] = useState("");
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("/api/tables");
        const fetchedTables = response.data;
        dispatch(createTable(fetchedTables));

        // Check local storage for saved tables
        const savedTables = localStorage.getItem("tables");
        if (savedTables) {
          const parsedTables = JSON.parse(savedTables);
          dispatch(createTable(parsedTables));
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchTables();
  }, [dispatch]);

  const handleCreateTable = async () => {
    const newTable = {
      name: newTableName,
      columns: ["Date", "Customer Name", "Items Sold", "Quantity", "Unit"],
      rows: [],
    };
    try {
      const response = await axios.post<Table>("/api/tables", newTable);
      const createdTable = response.data;
      dispatch(createTable(createdTable));
      setActiveTableIndex(tables.length);

      // Save updated tables to local storage
      localStorage.setItem("tables", JSON.stringify(tables));
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      await axios.delete(`/api/tables?id=${tableId}`);
      dispatch(deleteTable({ tableId }));
      setActiveTableIndex(0);

      // Save updated tables to local storage
      localStorage.setItem("tables", JSON.stringify(tables));
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  const handleAddRow = (tableId: string) => {
    dispatch(addRow({ tableId }));

    // Save updated tables to local storage
    localStorage.setItem("tables", JSON.stringify(tables));
  };

  const handleAddColumn = (tableId: string) => {
    const columnName = `Column ${tables[activeTableIndex].columns?.length + 1}`;
    dispatch(addColumn({ tableId, columnName }));
    // Save updated tables to local storage
    localStorage.setItem("tables", JSON.stringify(tables));
  };

  const saveTableData = async (tableId: string) => {
    const table = tables.find((table) => table._id === tableId);
    if (table) {
      try {
        await axios.put(`/api/tables?id=${tableId}`, table);
        localStorage.setItem("tables", JSON.stringify(table));
      } catch (error) {
        console.error("Error saving table data:", error);
      }
    }
  };
  const handleCellValueChange = (
    tableId: string,
    rowIndex: number,
    columnName: string,
    value: string
  ) => {
    dispatch(updateCellValue({ tableId, rowIndex, columnName, value }));

    // Save updated tables to local storage
    localStorage.setItem("tables", JSON.stringify(tables));

    // Save updated table data to the database
    saveTableData(tableId);
  };

  const handleDeleteColumn = (tableId: string, columnName: string) => {
    dispatch(deleteColumn({ tableId, columnName }));
    // Save updated tables to local storage
    localStorage.setItem("tables", JSON.stringify(tables));

    // Save updated table data to the database
    saveTableData(tableId);
  };

  const activeTable = tables[activeTableIndex];

  return (
    <>
      <div className="flex">
        <div className="w-[300px] flex flex-col mb-4 border-r border-gray-300">
          <div className="px-4 py-4 flex justify-between items-center">
            <h1 className="font-semibold text-base">Databases</h1>
            <button>
              <Plus size={15} />
            </button>
          </div>
          {tables.map((table, index) => (
            <button
              key={table._id}
              className={` px-6 py-2 text-sm font-medium ${
                index === activeTableIndex ? "bg-gray-200" : "bg-gray-50"
              }`}
              onClick={() => setActiveTableIndex(index)}
            >
              {table.name}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-end">
            <div className="flex items-center justify-center py-4">
              <input
                type="text"
                placeholder="enter new table name"
                className="text-black py-1 mr-3 border border-gray-300 px-3 "
                value={newTableName}
                onBlur={(e) => setNewTableName(e.target.value)}
              />
              <button
                className="ml-auto text-sm px-4 py-2 bg-green-200 text-green-500 rounded"
                disabled={newTableName === ""}
                onClick={handleCreateTable}
              >
                Create Table
              </button>
            </div>
            {tables.length > 0 && (
              <button
                className="ml-2 px-4 text-sm py-2 bg-red-500 text-white rounded"
                onClick={() => handleDeleteTable(tables[activeTableIndex]._id)}
              >
                Delete Table
              </button>
            )}
          </div>
          {tables.length > 0 && (
            <div>
              <table className="w-full mx-3 border-collapse">
                <thead>
                  <tr>
                    {tables[activeTableIndex].columns?.map((column: string) => (
                      <th
                        key={column}
                        className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold"
                      >
                        <div className="flex items-center justify-between">
                          {column}
                          <button
                            className="ml-2 text-red-500"
                            onClick={() =>
                              handleDeleteColumn(
                                tables[activeTableIndex]._id,
                                column
                              )
                            }
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="border text-sm border-gray-300 px-4 py-2 bg-gray-100 font-semibold">
                      <button
                        className="flex justify-center items-center gap-4 text-gray-500"
                        onClick={() =>
                          handleAddColumn(tables[activeTableIndex]._id)
                        }
                      >
                        <Plus size={15} />
                        Add Column
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tables[activeTableIndex].rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tables[activeTableIndex].columns.map(
                        (column, columnIndex) => (
                          <td
                            key={columnIndex}
                            className="border border-gray-300 px-4 py-2"
                        
                          >
                            <input
                              type="text"
                              value={row[column] || ""}
                              onChange={(e) =>
                                handleCellValueChange(
                                  tables[activeTableIndex]._id,
                                  rowIndex,
                                  column,
                                  e.target.value
                                )
                              }
                              className="text-blackborder-none py-1 outline-none focus:outline-none"
                            />
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="mt-4 px-4 mx-4 py-2 text-xs bg-gray-500 text-white rounded"
                onClick={() => handleAddRow(tables[activeTableIndex]._id)}
              >
                Add Row
              </button>
              <button
                className="mt-4 px-4 py-2 text-xs bg-gray-500 text-white rounded"
                onClick={() => saveTableData(tables[activeTableIndex]._id)}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
