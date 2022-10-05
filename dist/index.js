"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 8000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
mongoose_1.default.connect(
// `mongodb+srv://${DB_USER}:${DB_PASSWORD}@shubham0.4cnas.mongodb.net/?retryWrites=true&w=majority`,
"mongodb+srv://zocketUser:zocket123@shubham0.4cnas.mongodb.net/zocket", { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("Database not connected" + err);
    }
    else {
        console.log("Database connected");
    }
});
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (_req, res) => {
    res.end("Hello shubbi World!");
});
app.listen(port, () => {
    console.log(`Ready on port ${port}`);
});
