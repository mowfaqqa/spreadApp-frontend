import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { addRow, updateCell } from "../../features/tableSlice";

type TableProps = {
  columns: string[];
};

const Table: React.FC<TableProps> = ({ columns }) => {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.table.rows);

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
  }, [dispatch]);

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

  // Save table data to local storage on changes
  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(rows));
  }, [rows]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
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
