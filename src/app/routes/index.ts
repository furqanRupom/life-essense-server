import express from "express";
import { userRoutes } from "../modules/user/user.routes";


const router = express.Router();


const moduleRoutes = [
    {
        path: "/",
        route: userRoutes
    },
    
   
]



moduleRoutes.forEach(({ path, route }) => router.use(path, route))

export default router;
