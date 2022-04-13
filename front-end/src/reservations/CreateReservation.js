import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import validateDate from "./validateDate";

export default function CreateReservation({ reservations, setReservations }) {
  const history = useHistory();
  const [errorAlerts, setErrorAlerts] = useState([]);

  let handleSubmit = (res) => {
    const abortController = new AbortController();
    setErrorAlerts([]);
    if (validateDate(res, setErrorAlerts)) {
      createReservation(res, abortController.signal)
        .then(history.push(`/dashboard?date=${res.reservation_date}`))
        .catch(setErrorAlerts);
    }
    return () => abortController.abort();
  };

  function handleCancel() {
    history.goBack();
  }

  let errors;
  if (errorAlerts.length >= 1) {
    errors = errorAlerts.map((error, i) => {
      return (
        <div key={i}>
          <ErrorAlert error={error} />
        </div>
      );
    });
  }

  return (
    <main>
      <h1 className="font-weight-bold d-flex justify-content-center mt-4">New Reservation</h1>
      {errors}
      <ReservationForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
    </main>
  );
}