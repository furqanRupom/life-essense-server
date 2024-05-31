import express, { Application, Request, Response } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

dotenv.config();
// https://life-essence.vercel.app
const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin:"http://localhost:3000",credentials:true}))
app.use(express.json())
app.use(cookieParser());






app.use('/api',router);

app.get('/', (req: Request, res: Response) => {
    res.send('Blood is linking successfully')
})




app.use(globalErrorHandler)


export default app