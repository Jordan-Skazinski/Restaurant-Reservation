# Restaurant Reservation


This application is for restaurants to allows users to create, update, view, delete reservations, as well as seat them at varius tables within the restaurant.


# Technologies & Tools
 * React
 * React hooks
 * React router
 * Node
 * Postgres
 * Express
 * CSS
 * Bootstrap4
 * HTML
 * JavaScript
 * RESTful APIs
 
 
# To Run Locally
 1. Fork & Clone the repostory
 2. Run npm install
 3. Run npm run start:dev to start
 
# env. Variables

 1. Backend: DATABASE_URL, DATABASE_URL_DEVELOPMENT, DATABASE_URL_TEST, DATABASE_URL_PREVIEW
 2. Frontend: REACT_APP_API_BASE_URL (NOTE: this does note process correctly with the Heroku website, so this has been hardcoded in the frontend api.js file at the top)
 
# Connect to database

 1. Run npx knex migrate:latest to populate database with tables.
 2. Run npx knex seed:run to seed data into database.
 3. Run npm run test to run tests on local app - data needs to be seeded with correct data before tests can pass.
