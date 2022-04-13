const service = require("./reservations.service");
/**
 * List handler for reservation resources
 */
 async function list(request, response) {
  const date = request.query.date;
  const mobile_number = request.query.mobile_number;
  const reservations = await service.list(date, mobile_number);
  const res = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );
  response.json({ data: res });
}


module.exports = {
  list,
};
