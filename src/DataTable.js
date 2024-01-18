// Import necessary modules
import React from "react";
import { useTable } from "react-table";

// Create a functional component
const DataTable = (props) => {
  console.log("bhaiya table m ye aya hai", props.data);
  const data = props.data;
  // Define columns based on the keys of the first item in the data array
  const columns = React.useMemo(
    () =>
      Object.keys(data[0]).map((key) => ({
        Header: key,
        accessor: key,
      })),
    [data]
  );

  // Create a table instance

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Render the table
  return (
    <>
      <h3>table - 1</h3>
      <table
        className="borderedtable"
        {...getTableProps()}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{ border: "1px solid #ddd", padding: "8px" }}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;
