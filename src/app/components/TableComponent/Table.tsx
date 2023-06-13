import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  createTable,
  deleteTable,
  addRow,
  updateCell,
  addColumn,
  deleteColumn,
} from "../../features/tableSlice";
import { Trash } from "react-feather";

type TableProps = {
  columns: string[];
};

const Table: React.FC<TableProps> = ({ columns }) => {
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.table.tables);
  const [newTableName, setNewTableName] = useState("");
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  useEffect(() => {
    if (tables?.length! === 0) {
      dispatch(
        createTable({
          id: "1",
          name: "Spreadsheet 1",
          columns: [
            "Date",
            "Customer name",
            "item sold",
            "Quantity",
            "Unit price",
          ],
          rows: [{}],
        })
      );
    }
  }, [dispatch, tables?.length]);

  const handleCreateTable = () => {
    if (newTableName.trim() !== "") {
      dispatch(
        createTable({
          id: new Date().getTime().toString(),
          name: newTableName,
          columns: [
            "Date",
            "Customer name",
            "item sold",
            "Quantity",
            "Unit price",
          ],
          rows: [{}],
        })
      );
      setNewTableName("");
    }
  };
  const handleDeleteTable = (tableId: string) => {
    dispatch(deleteTable(tableId));
  };
  const handleAddRow = (tableId: string) => {
    dispatch(addRow(tableId));
  };

  const handleCellChange = (
    tableId: string,
    rowIndex: number,
    column: string,
    value: string
  ) => {
    dispatch(
      updateCell({
        tableId,
        rowIndex,
        column,
        value,
      })
    );
  };

  const handleAddColumn = (tableId: string) => {
    const newColumn = prompt("Enter column name:");
    if (newColumn && newColumn.trim() !== "") {
      dispatch(addColumn({ tableId, column: newColumn }));
    }
  };

  const handleDeleteColumn = (tableId: string, columnIndex: number) => {
    dispatch(deleteColumn({ tableId, columnIndex }));
  };

  const handleTabClick = (tableIndex: number) => {
    setActiveTableIndex(tableIndex);
  };
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="New Table Name"
          className="text-black"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <button onClick={handleCreateTable}>Create Table</button>
      </div>
      <div>
        <ul className="flex">
          {tables.map((table, tableIndex) => (
            <li
              key={tableIndex}
              className={`cursor-pointer p-2 ${
                activeTableIndex === tableIndex ? "bg-gray-300" : ""
              }`}
              onClick={() => handleTabClick(tableIndex)}
            >
              {table.name}
            </li>
          ))}
        </ul>
      </div>
      {tables.map((table, tableIndex) => (
        <div
          key={table.id}
          className={`${activeTableIndex === tableIndex ? "" : "hidden"}`}
        >
          <h2>{table.name}</h2>
          <table>
            <thead>
              <tr>
                {table.columns.map((column, columnIndex) => (
                  <th key={columnIndex}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {table.columns.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      <input
                        type="text"
                        value={row[column] || ""}
                        onChange={(e) =>
                          handleCellChange(
                            table.id,
                            rowIndex,
                            column,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => handleDeleteColumn(table.id, rowIndex)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleAddRow(table.id)}>Add Row</button>
          <button onClick={() => handleAddColumn(table.id)}>Add Column</button>
          <button onClick={() => handleDeleteTable(table.id)}>
            Delete Table
          </button>
        </div>
      ))}
    </div>
  );
};

export default Table;
