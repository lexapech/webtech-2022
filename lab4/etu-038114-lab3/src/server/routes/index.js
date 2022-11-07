import express from 'express'
import {distdir} from "../app.js";
import path from "path";
import {adminAuth} from "./auth.js";
const router = express.Router()

router.get('/',adminAuth, (req, res ) => {
    res.redirect("/users");
})

router.get('/users',adminAuth, (req, res ) => {
    res.sendFile(path.resolve(distdir,"userlist.html"))
})

router.get('/friends',adminAuth, (req, res ) => {
        res.sendFile(path.resolve(distdir,"friendlist.html"))
})
router.get('/news',adminAuth, (req, res) => {
    res.sendFile(path.resolve(distdir,"news.html"))
})

router.get('*', (req, res) => {
    res.sendFile(path.resolve(distdir,"404.html"))
})
export default router