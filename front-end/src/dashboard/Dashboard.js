import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationRow from "./ReservationRow";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  const reservationsJSX = () => {
    return reservations.map((reservation) => (
      <ReservationRow
        key={reservation.reservation_id}
        reservation={reservation}
      />
    ));
  };

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handleClick({ target }) {
     
    

  }

  
  return (
    <main>
      <div
        className="w-80 ml-2 pr-4 mr-2 pt-4 pb-4"
        style={{ fontFamily: "Courier", height: "100vh" }}
      >
        <h1
          className="d-flex justify-content-center text-center text-wrap mt-3"
          style={{ fontSize: "50px" }}
        >
          Periodic Tables
        </h1>
        
        <div >
          <h2 className="d-flex justify-content-center mt-5 mb-4">Dashboard</h2>

          <div className="mt-4 mb-4 d-flex justify-content-center">
            <button
              className="btn btn-xs btn-dark btn-outline-light mx-3 px-3"
              // className="btn-xs rounded-pill shadow-none border-style-none btn-white mx-3 px-2 text-black"
              type="button"
              name="previous"
              onClick={handleClick}
            >
              Previous
            </button>
            <button
              className="btn btn-xs btn-dark btn-outline-light mx-3 px-3"
              type="button"
              name="today"
              onClick={handleClick}
            >
              Today
            </button>
            <button
              className="btn btn-xs btn-dark btn-outline-light mx-3 px-3"
              type="button"
              name="next"
              onClick={handleClick}
            >
              Next
            </button>
          </div>

          <h4 className="mt-4 font-weight-bold d-flex justify-content-center mb-2">
            {date}
          </h4>

          <h4 className="mb-4 mt-4 pl-1 font-weight-bold">Reservations</h4>

          <ErrorAlert error={reservationsError} />

          
          <table className="table text-wrap text-center table-hover">
            <thead className="thead-dark">
              <tr className="text-center">
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Mobile Number</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">People</th>
                <th scope="col">Status</th>
                <th scope="col">Edit</th>
                <th scope="col">Cancel</th>
                <th scope="col">Seat</th>
              </tr>
            </thead>
            <tbody>{reservationsJSX()}</tbody>
          </table>

          <br />
          <br />

          

          


        </div>
      </div>
    </main>
  );
}
export default Dashboard;
