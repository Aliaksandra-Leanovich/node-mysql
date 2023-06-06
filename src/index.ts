// import { AppDataSource } from "./data-source";
// import { User } from "./entities";

// AppDataSource.initialize()
//   .then(async () => {
//     console.log("Inserting a new user into the database...");
//     const user = new User();

//     await AppDataSource.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await AppDataSource.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log(
//       "Here you can setup and run express / fastify / any other framework."
//     );
//   })
//   .catch((error) => console.log(error));

import app from "./app";
import { initializeDatabase } from "./data-source";
import * as dotenv from "dotenv";

dotenv.config();

(async () => {
  await initializeDatabase();
  app.listen(process.env.SERVER_PORT, function () {
    console.log("The app is running on port " + process.env.SERVER_PORT);
  });
})();
