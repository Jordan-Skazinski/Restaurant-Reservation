import React from "react";
import { finishTable, listTables } from "../utils/api";


/** a function to display an individual 'TableRow' with data (columns) shown below */
export default function TableRow({ table }) {
  /** if no table or undefined, return nulll */
  if (!table) return null;


  // /** handles finishing a seated table */
  // function handleFinish() {
  //   if (
  //     window.confirm(
  //       "Is this table ready to seat new guests? This cannot be undone."
  //     )
  //   ) {
  //     const abortController = new AbortController();
  //     finishTable(table.table_id, abortController.signal)
  //       // .then(loadDashboard)
  //       .then(() => window.location.reload())
  //     return () => abortController.abort();
  //   }
  // }
  const handleFinish = (table_id) => {
    const abortController = new AbortController();
    let result = window.confirm(
      "Is this table ready to seat new guests? \n This cannot be undone."
    );
    if (result)
      finishTable(table_id, abortController.signal)
        .then(() => window.location.reload())
    return () => abortController.abort();
  };
  

  /** displays a single table (row), which is mapped in tablesJSX() in Dashboard,
   * which then displays a list of all tables */
  return (
    <tr style={{ fontFamily: "Courier" }} >
      <th className="text-center text-white" scope="row">{table.table_id}</th>
      <td className="text-center text-white">{table.table_name}</td>
      <td className="text-center text-white">{table.capacity}</td>
      <td className="text-center text-white" data-table-id-status={table.table_id}>
        {table.status}
      </td>
      <td className="text-center text-white">
        {table.reservation_id ? table.reservation_id : "--"}
      </td>

      {table.status === "occupied" && (
        <td className="text-center">
          <button
            className="btn btn-sm btn-outline-light"
            data-table-id-finish={table.table_id}
            onClick={(e) => {
              e.preventDefault();
              handleFinish(table.table_id);
            }}
            type="button"
          >
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}