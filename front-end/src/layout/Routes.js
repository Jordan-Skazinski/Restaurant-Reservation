import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import { changeReservationStatus, listReservations, listTables } from "../utils/api";
import Dashboard from "../dashboard/Dashboard";
import NewTable from "../tables/NewTable";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search";
import EditReservation from "../reservations/EditReservation";
import CreateReservation from "../reservations/CreateReservation";


/** defines all the routes for the application */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [date, setDate] = useState("");
  const [tablesError, setTablesError] = useState(null);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      setTablesError(null);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);

      listTables(abortController.signal).then(setTables).catch(setTablesError);

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


  /** retursn the components and the paths */
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={`/dashboard`} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={`/dashboard`} />
      </Route>

      {/* <Route path="/reservations/new">
        <NewReservation loadDashboard={loadDashboard} />
      </Route> */}
      <Route path="/reservations/new">
        <CreateReservation 
          // loadDashboard={loadDashboard} 
          reservations={reservations}
          setReservations={setReservations}
        />
      </Route>

      {/* <Route path="/reservations/:reservation_id/edit">
        <NewReservation loadDashboard={loadDashboard} edit={true} />
      </Route> */}
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation 
          reservations={reservations}
          setReservations={setReservations}
        />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation 
          tables={tables} 
          setTables={setTables}
          reservations={reservations}
          setReservations={setReservations}
        />
      </Route>

      <Route path="/tables/new">
        <NewTable 
        />
      </Route>

      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          handleCancel={handleCancel}
        />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}


export default Routes;