import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatReservation } from "../utils/api";

export default function SeatReservation({
  tables,
  reservations,
  setTables,
  setReservations,
}) {
  const initialState = { table_id: 0 };
  const [formData, setFormData] = useState(initialState);
  const [singleRes, setSingleRes] = useState(initialState);
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();

    readReservation(reservation_id).then(setSingleRes).catch(setError);

    listTables().then(setTables).catch(setError);

    return abortController.abort();
  }, [reservation_id, setTables]);

  let handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    if (formData.table_id > 0) {
      seatReservation(reservation_id, formData.table_id)
        .then(() =>
          history.push(`/dashboard?date=${singleRes.reservation_date}`)
        )
        .catch(setError);
    } else {
      setError({ message: "Not a valid table" });
    }
    return () => abortController.abort();
  };

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const tableMenu = tables ? (
    tables.map((table) => {
      // if (table.reservation_id === null && singleRes.people <= table.capacity) {
        return (
          <option
            name={table.table_id}
            value={table.table_id}
            key={table.table_id}
          >
            {table.table_name} - {table.capacity}
          </option>
        );
      // } else return "";
    })
  ) : (
    <option defaultValue>No available tables</option>
  );

  return (
    <div>
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        
        <label className="form-label" htmlFor="table_id">
          Select Table:&nbsp;
        </label>
        
        <select className="form-select" name="table_id" onChange={handleChange}>
          <option defaultValue={0}>Please choose table:</option>
          {tableMenu}
        </select>
        
        <button className="btn btn-outline-light m-1" type="submit">
          Submit
        </button>
        
        <button
          className="btn btn-outline-light m-1"
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}