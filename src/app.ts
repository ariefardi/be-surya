import express from "express";
import logger from "morgan";
import * as path from "path";
import sequelize from "./config/database";
import { graphqlController } from "./controllers/graphqlController";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";
import cors from "cors";
// Routes
import { index } from "./routes/index";
// Create Express server
export const app = express();
app.use(cors()); // Allow all origins
sequelize.sync().then(() => {
    console.log("Database synced");
});
const PORT = process.env.PORT || 3000;

// Express configuration
app.set("port", PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/graphql", graphqlController);
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

console.log("masuk gak");
app.use("/", index);

app.use(errorNotFoundHandler);
app.use(errorHandler);
