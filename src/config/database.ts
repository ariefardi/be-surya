import { Sequelize } from "sequelize-typescript";
import { MaintenanceRequest } from "../models/MaintenanceRequest";
import { User } from "..//models/User";
const sequelize = new Sequelize({
    database: "postgres",
    dialect: "postgres",
    username: "postgres",
    password: "123456",
    host: "localhost",
    models: [MaintenanceRequest, User], // Add models here
});

export default sequelize;
