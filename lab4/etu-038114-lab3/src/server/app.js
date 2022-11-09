import express from 'express'
import Storage from "./storage.js";
import indexRouter from './routes/index.js'
import apiRouter from './routes/api.js'
import authRouter, {socketAuth} from './routes/auth.js'
import clientRouter from './routes/client.js'
import SocketServer from "./socketServer.js"
import fileParser from 'express-fileupload'

import url from "url";
import path from "path";
import cors from 'cors'
import passport from 'passport'
import crypto from 'crypto'
const storage = new Storage()
const app = express()


let token = crypto.randomBytes(64).toString('hex')


let argv = process.argv.slice(2)
let dir="./gulp"
if(argv[0]==="webpack") {
    console.log("starting with webpack")
    dir="./webpack"
}
else {
    console.log("starting with gulp")
}

const config = {
        credentials: true,
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept'
};


let distdir = url.fileURLToPath(new URL('../../dist', import.meta.url));
distdir =path.resolve(distdir,dir)
console.log(`distdir: ${distdir}`)


app.use(passport.initialize());
app.use("/assets",express.static(path.resolve(distdir,"./assets")))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(fileParser())

app.use(cors(config))
app.use("/api",apiRouter)
app.use("/userapi",clientRouter)
app.use("/",authRouter)
app.use("/",indexRouter)

let socketServer = new SocketServer()

app.listen(3000, ()=>{
    console.log("server started")
});




export {socketServer}
export {storage}
export {distdir}
export {token}