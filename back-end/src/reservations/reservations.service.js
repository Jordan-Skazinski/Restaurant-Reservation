const knex = require("../db/connection");

const tableName = "reservations";


function list(date, mobile_number) {
    if (date) {
      return knex(tableName)
        .select("*")
        .where({ reservation_date: date })
        .orderBy("reservation_time", "asc");
    }
}
module.exports = {
    list
};