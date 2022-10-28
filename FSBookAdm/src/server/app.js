import express from 'express'
import Storage from "./storage.js";
import indexRouter from './routes/index.js'
import apiRouter from './routes/api.js'
import url from "url";
import path from "path";
const storage = new Storage()
const app = express()
//app.set('views', './src/server/views');
//app.set("view engine","ejs")
let argv = process.argv.slice(2)
let dir="./gulp"
if(argv[0]==="webpack") {
    console.log("starting with webpack")
    dir="./webpack"
}
else {
    console.log("starting with gulp")
}

let distdir = url.fileURLToPath(new URL('../../dist', import.meta.url));
distdir =path.resolve(distdir,dir)
console.log(`distdir: ${distdir}`)
app.use("/assets",express.static(path.resolve(distdir,"./assets")))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",apiRouter)
app.use("/",indexRouter)



app.listen(3000, ()=>{
    console.log("server started")
});
export {storage}
export {distdir}