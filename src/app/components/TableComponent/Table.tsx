import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  createTable,
  addRow,
  updateCell,
  addColumn,
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

  const handleAddRow = (tableIndex: number) => {
    dispatch(addRow(tableIndex));
  };

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

  const handleAddColumn = (tableIndex: number) => {
    const newColumn = prompt("Enter column name:");
    if (newColumn && newColumn.trim() !== "") {
      dispatch(addColumn({ tableIndex, column: newColumn }));
    }
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
          key={tableIndex}
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
                            tableIndex,
                            rowIndex,
                            column,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleAddRow(tableIndex)}>Add Row</button>
          <button onClick={() => handleAddColumn(tableIndex)}>
            Add Column
          </button>
        </div>
      ))}
    </div>
  );
};

export default Table;
