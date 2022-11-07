import express from 'express'
import {storage} from "../app.js";
import {userConverter, getGenitive, getUserInfo, userFriendInfo} from "../utils.js";
import * as url from "url";
import {userAuth} from "./auth.js";

const router = express.Router()

router.get('/user',userAuth ,(req, res) => {
    let id =req.query.id?req.query.id:req.user.id
    res.end(JSON.stringify(storage.select((row) => row.id===id, storage.users).map(userConverter).map(getUserInfo)[0]))
})

router.get('/friends',userAuth ,(req, res) => {
    let id =req.query.id?req.query.id:req.user.id
    let temp = storage.select((row) => row.user1===id || row.user2===id, storage.friends)
    let list = storage.select((row) => row.id!==id && temp.find((t)=>row.id===t.user1 || row.id===t.user2), storage.users)
        .map(userConverter)
        .filter((u)=>u.status!=="banned")
        .map(userFriendInfo)

    res.end(JSON.stringify({friends:list,genitive:getGenitive(id)}))
})

export default router