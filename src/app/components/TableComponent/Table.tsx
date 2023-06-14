import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRow,
  updateCell,
  addColumn,
  createTable,
  deleteTable,
  deleteColumn,
} from "../../features/tableSlice";
import { RootState } from "../../store";
import { Plus, Trash } from "react-feather";

type TableProps = {
  columns: string[];
};
const Table: React.FC<TableProps> = ({ columns }) => {
  const initialColumns = useMemo(
    () => ["Date", "Customer name", "item sold", "Quantity", "Unit price"],
    []
  );
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.table.tables);
  const [activeTableIndex, setActiveTableIndex] = useState(0);
  const [newTableName, setNewTableName] = useState("");

  
  useEffect(() => {
    if (tables.length === 0) {
      dispatch(
        createTable({
          id: "1",
          name: "Spreadsheet 1",
          columns: initialColumns,
          rows: [{}],
        })
      );
    }
  }, [dispatch, initialColumns, tables.length]);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tables));
  }, [tables]);

  // create table
  const handleCreateTable = () => {
    if (newTableName.trim() !== "") {
      dispatch(
        createTable({
          id: new Date().getTime().toString(),
          name: newTableName,
          columns: initialColumns,
          rows: [{}],
        })
      );
      setNewTableName("");
    }
  };

  // delete table
  const handleDeleteTable = (tableId: string) => {
    dispatch(deleteTable(tableId));
  };
  // Add new row
  const handleAddRow = (tableId: string) => {
    dispatch(addRow(tableId));
  };

  // Handle input change in cells

  const handleCellChange = (
    tableIndex: number,
    rowIndex: number,
    column: string,
    value: string
  ) => {
    dispatch(
      updateCell({
        tableIndex,
        rowIndex,
        column,
        value,
      })
    );
  };

  // add new column
  const handleAddColumn = (tableId: string) => {
    const newColumn = prompt("Enter column name:");
    if (newColumn && newColumn.trim() !== "") {
      dispatch(addColumn({ tableId, column: newColumn }));
    }
  };
  const handleDeleteColumn = (tableId: string, columnIndex: number) => {
    dispatch(deleteColumn({ tableId, columnIndex }));
  };
  //Tab handler
  const handleTabClick = (tableIndex: number) => {
    setActiveTableIndex(tableIndex);
  };
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
          {tables.map((table, tableIndex) => (
            <button
              key={tableIndex}
              className={` px-6 py-2 text-sm font-medium ${
                tableIndex === activeTableIndex ? "bg-gray-200" : "bg-gray-50"
              }`}
              onClick={() => handleTabClick(tableIndex)}
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
                onChange={(e) => setNewTableName(e.target.value)}
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
                onClick={() => handleDeleteTable(tables[activeTableIndex].id)}
              >
                Delete Table
              </button>
            )}
          </div>
          {tables.length > 0 && (
            <>
              {tables.map((table, tableIndex) => (
                <div
                  key={tableIndex}
                  className={`${
                    activeTableIndex === tableIndex ? "" : "hidden"
                  }`}
                >
                  <h2>{table.name}</h2>
                  <table className="w-full mx-3 border-collapse">
                    <thead>
                      <tr>
                        {table.columns?.map((column: string, columnIndex) => (
                          <th
                            key={columnIndex}
                            className="border border-gray-300 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold"
                          >
                            <div className="flex items-center justify-between">
                              {column}
                              <button
                                className="ml-2 text-red-500"
                                onClick={() =>
                                  handleDeleteColumn(table.id, columnIndex)
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
                            onClick={() => handleAddColumn(table.id)}
                          >
                            <Plus size={15} />
                            Add Column
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {table.columns.map((column, columnIndex) => (
                            <td
                              key={columnIndex}
                              className="border border-gray-300 px-4 py-2"
                            >
                              <input
                                type="text"
                                value={row[column] || ""}
                                onChange={(e) =>
                                  handleCellChange(
                                    tableIndex,
                                    rowIndex,
                                    column,
                                    e.target.value
                                  )
                                }
                                className="text-black border-none py-1 outline-none focus:outline-none"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="mt-4 px-4 mx-4 py-2 text-xs bg-gray-500 text-white rounded"
                    onClick={() => handleAddRow(table.id)}
                  >
                    Add Row
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
function uuidv4() {
  throw new Error("Function not implemented.");
}
