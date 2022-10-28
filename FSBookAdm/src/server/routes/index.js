import express from 'express'
import {distdir} from "../app.js";
import path from "path";
const router = express.Router()

router.get('/', (req, res, next) => {
    res.redirect("/users");
})

router.get('/users', (req, res, next) => {
    res.sendFile(path.resolve(distdir,"userlist.html"))
})

router.get('/friends', (req, res, next) => {
        res.sendFile(path.resolve(distdir,"friendlist.html"))
})
router.get('/news', (req, res, next) => {
    res.sendFile(path.resolve(distdir,"news.html"))
})

router.get('*', (req, res, next) => {
    res.sendFile(path.resolve(distdir,"404.html"))
})
export default router