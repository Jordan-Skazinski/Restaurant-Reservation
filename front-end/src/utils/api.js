/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-time";

const API_BASE_URL = 
process.env.REACT_APP_API_BASE_URL ||  "http://localhost:5000";
//process.env.REACT_APP_API_BASE_URL || "https://backend-skazinski.herokuapp.com";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the request.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value.toString())
    );
  }

  return await fetchJson(url, { headers, signal, method: "GET" }, []);
}

// posts a new reservation to the reservations page 
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const body = JSON.stringify({ data: reservation });
  return await fetchJson(url, { headers, signal, method: "POST", body }, []);
}

// returns all tables on the tables page 
export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  return await fetchJson(url, { headers, signal, method: "GET" }, []);
}

// posts a new table to the tables page 
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;

  const body = JSON.stringify({ data: table });

  return await fetchJson(url, { headers, signal, method: "POST", body }, []);
}


/**
 * Retrieves the reservation with the specified `reservationId`
 * @param reservationId
 *  the id of the target
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the saved reservation.
 */
 export async function readReservation(reservationId, signal) {
  console.log(reservationId);
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  return await fetchJson(url, { signal })
    .then(formatReservationDate)
    .then(formatReservationTime);
}


// returns updated data to a given reservation's page 
export async function editReservation(reservation_id, reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const body = JSON.stringify({ data: reservation });
  return await fetchJson(url, { headers, signal, method: "PUT", body }, []);
}

/** returns updated data about the reservation's status to the given reservation's page */
export async function updateReservationStatus(reservation_id, status, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const body = JSON.stringify({ data: { status: status } });
  return await fetchJson(url, { headers, signal, method: "PUT", body }, []);
}

/**
 * Updates the status of a reservation
 * @param reservation_id
 *  the id of the reservation to update
 * @param data
 *  the new status
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated reservation.
 */

 export async function changeReservationStatus(reservation_id, data, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: data } }),
    signal,
  };
  return await fetchJson(url, options, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// removes a table for the seat page 
export async function finishTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  return await fetchJson(url, { headers, signal, method: "DELETE" });
}

// updates the table status and displays it in the tables list 
export async function seatTable(reservation_id, table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const body = JSON.stringify({ data: { reservation_id: reservation_id } });
  return await fetchJson(url, { headers, signal, method: "PUT", body }, []);
}


export async function seatReservation(reservation_id, table_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates a existing reservation
 *  @param data
 *  the information of the reservation to update, which must have an `id` property
 * @returns {Promise<[signal]>}
 *  a promise that resolves to the updated reservation.
 */
 export async function updateReservation(data, signal) {
  const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options)
    .then(formatReservationDate)
    .then(formatReservationTime);
}
