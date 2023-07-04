import "reflect-metadata";
import AuthenticationRoutes from "./controllers/authentication-controller";
import TestRoutes from "./controllers/tests-controller";
import UserRoutes from "./controllers/users-controller";
import QuestionsRoutes from "./controllers/questions-controller";
import AnswersRoutes from "./controllers/answers-controller";
import express = require("express");
import bodyParser = require("body-parser");
import { authenticateJWT } from "./utils";

const app = express();
const cors = require("cors");
const { json, urlencoded } = bodyParser;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/", AuthenticationRoutes);
app.use("/test", authenticateJWT, TestRoutes);
app.use("/users", authenticateJWT, UserRoutes);
app.use("/questions", authenticateJWT, QuestionsRoutes);
app.use("/answers", authenticateJWT, AnswersRoutes);

app.on("error", function (error) {
  console.error("An error occurred:", error);
});

export default app;
