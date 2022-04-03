/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async ({ response }) => {
  response.redirect().toPath("docs/index.html");
});

Route.group(() => {
  Route.resource("/venue", "v1/VenuesController")
    .apiOnly()
    .middleware({ "*": ["auth", "owner", "verify"] });
  Route.resource("/venue.fields", "v1/FieldsController")
    .apiOnly()
    .middleware({ "*": ["auth", "owner", "verify"] });
  Route.resource("/fields.booking", "v1/BookingsController")
    .apiOnly()
    .middleware({ "*": ["auth", "user", "verify"] });

  Route.group(() => {
    Route.post("/register", "v1/AuthController.register").as("register");
    Route.post("/login", "v1/AuthController.login").as("login");
    Route.post("/otp-verification", "v1/AuthController.otp_verification").as(
      "verify"
    );
  }).as("auth");

  Route.group(() => {
    Route.get("/fields", "v1/FieldsController.all")
      .as("field.all")
      .middleware(["auth", "owner", "verify"]);
    Route.get("/bookings", "v1/BookingsController.all")
      .as("booking.all")
      .middleware(["auth", "user", "verify"]);
    Route.get("/schedules", "v1/BookingsController.schedules")
      .as("user.schedules")
      .middleware(["auth", "user", "verify"]);
    Route.put("/bookings/:id", "v1/BookingsController.join")
      .as("booking.join")
      .middleware(["auth", "user"]);
  }).as("custom");

  Route.get("/hello", "v1/TestsController.hello").as("test.hello");
})
  .prefix("api/v1")
  .as("apiv1");
