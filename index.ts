import express, { Request, Response } from 'express';
import dbConn from './config/dbConn';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users';
import employeeRoutes from './routes/employees';
import {
    globalErrhandler,
    notFound
} from "./middlewares/globalErrHandler";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;
declare module 'express' {
    interface Request {
        fileUrl?: string;
    }
}
dbConn();

app.use('/v1/users', usersRoutes);
app.use('/v1/employees', employeeRoutes);


app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello, TypeScript with Express!');
});
//err middleware
app.use(notFound);
app.use(globalErrhandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


