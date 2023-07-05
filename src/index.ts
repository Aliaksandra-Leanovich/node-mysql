import app from "./app";
import { initializeDatabase } from "./db";
import * as dotenv from "dotenv";

dotenv.config();

(async () => {
  const port = process.env.SERVER_PORT || 8000;
  await initializeDatabase();
  app.listen(port, function () {
    console.log("The app is running on port " + port);
  });
})();
