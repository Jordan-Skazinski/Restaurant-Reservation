const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//Validation


// checks the request for data 
async function validateData(request, response, next) {
  if (!request.body.data) {
    return next({ status: 400, message: "Body must include a data object" });
  }
  next();
}

// checks the fields to find missing ones
async function validateBody(request, response, next) {
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  //sends back a status msg if one is missing
  for (const field of requiredFields) {
    if (
      !request.body.data.hasOwnProperty(field) ||
      request.body.data[field] === ""
    ) {
      return next({ status: 400, message: `Field required: '${field}'` });
    }
  }

  if (
    Number.isNaN(
      Date.parse(
        `${request.body.data.reservation_date} ${request.body.data.reservation_time}`
      )
    )
  ) {
    return next({
      status: 400,
      message:
        "'reservation_date' or 'reservation_time' field is in an incorrect format",
    });
  }

  if (typeof request.body.data.people !== "number") {
    return next({ status: 400, message: "'people' field must be a number" });
  }

  if (request.body.data.people < 1) {
    return next({ status: 400, message: "'people' field must be at least 1" });
  }

  if (request.body.data.status && request.body.data.status !== "booked") {
    return next({
      status: 400,
      message: `'status' field cannot be ${request.body.data.status}`,
    });
  }

  next();
}

//checks the reservation date for valid entrys. Makeing sure its in the future, when the place is open, and that its not on a tuesday
async function validateDate(request, response, next) {
  const reserveDate = new Date(
    `${request.body.data.reservation_date}T${request.body.data.reservation_time}:00.000`
  );
  const todaysDate = new Date();

  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message: "'reservation_date' field: restaurant is closed on tuesday",
    });
  }

  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message:
        "'reservation_date' and 'reservation_time' field must be in the future",
    });
  }

  if (
    reserveDate.getHours() < 10 ||
    (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)
  ) {
    return next({
      status: 400,
      message: "'reservation_time' field: restaurant is not open until 10:30AM",
    });
  }

  if (
    reserveDate.getHours() > 22 ||
    (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message: "'reservation_time' field: restaurant is closed after 10:30PM",
    });
  }

  if (
    reserveDate.getHours() > 21 ||
    (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)
  ) {
    return next({
      status: 400,
      message:
        "'reservation_time' field: reservation must be made at least an hour before closing (10:30PM)",
    });
  }

  next();
}

//checks the id useing read service to see if the reservation_id exists
async function validateReservationId(request, response, next) {
  const { reservation_id } = request.params;
  const reservation = await service.read(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `reservation id ${reservation_id} does not exist`,
    });
  }
  response.locals.reservation = reservation;
  next();
}

//checks the status of the reservation for validity
async function validateUpdateBody(request, response, next) {
  if (!request.body.data.status) {
    return next({ status: 400, message: "body must include a status field" });
  }

  if (
    request.body.data.status !== "booked" &&
    request.body.data.status !== "seated" &&
    request.body.data.status !== "finished" &&
    request.body.data.status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `'status' field cannot be ${request.body.data.status}`,
    });
  }

  if (response.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`,
    });
  }
  next();
}


//handlers


//lists the reservations
async function list(request, response) {
  const date = request.query.date;
  const mobile_number = request.query.mobile_number;
  const reservations = await service.list(date, mobile_number);
  const res = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );
  response.json({ data: res });
}


//creates a new reservation and sends back the data with a 201 status
async function create(request, response) {
  request.body.data.status = "booked";
  const res = await service.create(request.body.data);
  response.status(201).json({ data: res[0] });
}

//updates a reservation
async function update(request, response) {
  await service.update(
    response.locals.reservation.reservation_id,
    request.body.data.status
  );

  response.status(200).json({ data: { status: request.body.data.status } });
}

//edits a reservation
async function edit(request, response) {
  const res = await service.edit(
    response.locals.reservation.reservation_id,
    request.body.data
  );
  response.status(200).json({ data: res[0] });
}

//reads a reservation
async function read(request, response) {
  response.status(200).json({ data: response.locals.reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateBody),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateUpdateBody),
    asyncErrorBoundary(update),
  ],
  edit: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateBody),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(edit),
  ],
  read: [
    asyncErrorBoundary(validateReservationId), 
    asyncErrorBoundary(read)
  ],
};