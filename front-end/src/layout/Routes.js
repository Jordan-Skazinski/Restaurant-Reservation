import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import { changeReservationStatus, listReservations } from "../utils/api";
import { today } from "../utils/date-time";
import CreateReservation from "../reservations/CreateReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState("");
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();


  useEffect(() => {
    setDate("");
    if (query.get("date")) {
      setDate(query.get("date"));
    } else {
      if (location.pathname === "/dashboard")
        history.push(`/dashboard?date=${today()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);

      
      return () => abortController.abort();
    }
    if (date) loadDashboard();
  }, [date, location.pathname]);

  function handleCancel(reservation_id) {
    const abortController = new AbortController();
    let result = window.confirm(
      "Do you want to cancel this reservation? \n \n This cannot be undone."
    );
    if (result)
      changeReservationStatus(
        reservation_id,
        "cancelled",
        abortController.signal
      )
        .then(() => window.location.reload())
        .catch(setReservationsError);

    return () => abortController.abort();
  }
 

  return (

    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/reservations/new">
        <CreateReservation 
          reservations={reservations}
          setReservations={setReservations} />
      </Route>


      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          handleCancel={handleCancel}
        />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
