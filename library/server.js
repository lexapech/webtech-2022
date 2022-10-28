import express from 'express'
import session from 'express-session'
import storage from 'memorystore'
import passport from 'passport'
import indexRouter from './routes/indexRoutes.js'
import apiRouter from './routes/apiRoutes.js'
import authRouter from './routes/authRoutes.js'
import fs from 'fs'
const app = express()
let MemoryStore = storage(session)
let enableSave=false
app.set("view engine","ejs")
app.use(express.static("static"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    saveUninitialized: false,
    resave: false,
    secret: 'keyboard cat'
}));
app.use(passport.authenticate('session'));
app.use("/",authRouter)
app.use("/api",apiRouter)
app.use("/",indexRouter)



app.listen(3000, ()=>{
    console.log("server started")
});

function writeJson(obj,file) {
    fs.writeFile('data/'+file, JSON.stringify(obj), 'utf8',()=>{});
}
export {writeJson}
export {enableSave}