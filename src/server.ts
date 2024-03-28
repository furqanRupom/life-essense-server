import express from "express";
import app from "./app";
import { Server } from "http";
import { config } from "./app/config";





const main = async () => {
    let server: Server

    server = app.listen(config.port, () => {
        console.log('the server is running on port 3000')
    })
}


main()