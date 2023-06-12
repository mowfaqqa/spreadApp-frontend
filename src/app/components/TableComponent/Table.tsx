import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  addColumn,
  addRow,
  removeColumn,
  updateCell,
} from "../../features/tableSlice";
import { Trash } from "react-feather";

type TableProps = {
  initialColumns: string[];
};

const Table: React.FC<TableProps> = ({ initialColumns }) => {
  const dispatch = useDispatch();
  const storedRows = useSelector((state: RootState) => state.table.rows);
  const storedColumns = useSelector((state: RootState) => state.table.columns);
  const [newColumn, setNewColumn] = useState("");

  useEffect(() => {
    if (storedColumns.length === 0) {
      dispatch(addColumn(""));
    }
  }, [dispatch, storedColumns.length]);

  // Save table data to local storage on changes
  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(storedRows));
    localStorage.setItem("tableColumns", JSON.stringify(storedColumns));
  }, [storedRows, storedColumns]);
  // Load table data from local storage on component mount

  useEffect(() => {
    const storedRows = localStorage.getItem("tableData");
    if (storedRows) {
      dispatch(addRow()); // Add an initial row
      const parsedRows = JSON.parse(storedRows);
      parsedRows.forEach((row: { [key: string]: string }) => {
        Object.keys(row).forEach((column) => {
          dispatch(
            updateCell({
              rowIndex: parsedRows.indexOf(row),
              column,
              value: row[column],
            })
          );
        });
      });
    } else {
      dispatch(addRow()); // Add an initial row if no data is stored
    }
  }, [dispatch, initialColumns]);

  // Add new column
  const handleAddColumn = () => {
    if (newColumn.trim() !== "") {
      dispatch(addColumn(newColumn));
      setNewColumn("");
    }
  };
  // remove column
  const handleRemoveColumn = (column: string) => {
    dispatch(removeColumn(column));
  };
  // Add new row
  const handleAddRow = () => {
    dispatch(addRow());
  };

  // Handle input change in cells
  const handleCellChange = (
    rowIndex: number,
    column: string,
    value: string
  ) => {
    dispatch(updateCell({ rowIndex, column, value }));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
        />
        <button onClick={handleAddColumn}>Add Column</button>
      </div>
      <table>
        <thead>
          <tr>
            {storedColumns.map((column) => (
              <th key={column}>
                <div className="flex items-center justify-between">
                {column}
                <button onClick={() => handleRemoveColumn(column)}>
                  <Trash size={15} />
                </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {storedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {storedColumns.map((column, columnIndex) => (
                <td key={columnIndex}>
                  <input
                    type="text"
                    value={row[column] || ""}
                    className="text-black"
                    onChange={(e) =>
                      handleCellChange(rowIndex, column, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default Table;
