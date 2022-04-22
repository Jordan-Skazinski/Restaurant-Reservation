import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";


/** returns a 'NewTable' form to create a new table that sits an entered quantity. */
export default function NewTable({ loadDashboard }) {
  const history = useHistory();

  const [error, setError] = useState([]);
  /** sets initial state of a table */
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });


  /* sets table info when entered */
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "capacity" ? Number(target.value) : target.value,
    });
  }


  /* saves table info and redirects to dashboard when form is submitted */
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (validateFields()) {
      createTable(formData, abortController.signal)
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch(setError);
    }

    return () => abortController.abort();
  }


  /* checks for table's capacity and length of table's name */
  function validateFields() {
    let foundError = null;

    if (formData.table_name === "" || formData.capacity === "") {
      foundError = {
        message:
          "invalid form: table name & capacity must be provided to create table",
      };
    } else if (formData.table_name.length < 2) {
      foundError = {
        message:
          "invalid table name: table name must contain at least two characters",
      };
    }

    setError(foundError);
    return foundError === null;
  }


  return (
    <div >
      <h2 className="font-weight-bold d-flex justify-content-center mt-4">
        New Table
      </h2>
      <div className="d-flex justify-content-center mt-4">
        <form className="font-weight-bold mt-2 w-75">
          {/* <ErrorAlert error={error} /> */}

          <label htmlFor="table_name">Table Name&nbsp;</label>
          <input
            name="table_name"
            id="table_name"
            className="form-control mb-3 border-dark"
            type="text"
            minLength="2"
            onChange={handleChange}
            value={formData.table_name}
            required
          />

          <label htmlFor="capacity">Capacity&nbsp;</label>
          <input
            name="capacity"
            id="capacity"
            className="form-control mb-3 border-dark"
            type="number"
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            required
            style={{ color: "black" }}
          />

          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-outline-light m-1"
              style={{ color: "white" }}
            >
              Submit
            </button>
            <button
              className="btn btn-outline-light m-1"
              type="button"
              onClick={history.goBack}
            >
              Cancel
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}