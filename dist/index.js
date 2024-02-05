"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConn_1 = __importDefault(require("./config/dbConn"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_1 = __importDefault(require("./routes/users"));
const employees_1 = __importDefault(require("./routes/employees"));
const globalErrHandler_1 = require("./middlewares/globalErrHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;
(0, dbConn_1.default)();
app.use('/v1/users', users_1.default);
app.use('/v1/employees', employees_1.default);
app.get('/', (req, res) => {
    res.status(200).send('Hello, TypeScript with Express!');
});
//err middleware
app.use(globalErrHandler_1.notFound);
app.use(globalErrHandler_1.globalErrhandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
