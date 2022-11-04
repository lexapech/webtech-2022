import express from 'express'
import {storage} from "../app.js";
import {userConverter, search, friendInfo,getGenitive} from "../utils.js";
import ru from '../../../data/ru.json' assert {type:'json'}
import * as url from "url";

const __dirname = url.fileURLToPath(new URL('../../client', import.meta.url));
const router = express.Router()

router.get('/users', (req, res) => {
    if (req.query.id) {
        res.end(JSON.stringify({users: storage.select((row) => row.id===req.query.id, storage.users).map(userConverter)}))
    }
    else if (req.query.search) {
        res.end(JSON.stringify({users: storage.select((row) => search(row,req.query.search), storage.users).map(userConverter)}))
    } else {
        res.end(JSON.stringify({users: storage.select(() => true, storage.users).map(userConverter)}))
    }
})

router.get('/friends', (req, res) => {
    console.log(req.path)
    let list=[]
    let name=null
    let showall = req.query.all === "true"
    if (req.query.id) {

        name =getGenitive(req.query.id)

        let temp = storage.select((row) => row.user1===req.query.id || row.user2===req.query.id, storage.friends)
        list = storage.select((row) => row.id!==req.query.id && temp.find((t)=>row.id===t.user1 || row.id===t.user2), storage.users)
            .map(friendInfo)
            .filter((u)=>!u.banned || showall)
            .map(userConverter)
    }
    res.end(JSON.stringify({users: list,name:name}))
})

router.get('/news', (req, res) => {
    console.log(req.path)
    let news=[]
    let name=null
    let showall=req.query.all==="true"
    if (req.query.id) {

        name =getGenitive(req.query.id)

        let temp = storage.select((row) => row.user1===req.query.id || row.user2===req.query.id, storage.friends)
        let list = storage.select((row) => row.id!==req.query.id && temp.find((t)=>row.id===t.user1 || row.id===t.user2), storage.users).map(userConverter)
        let idlist = list.map((x)=>x.id)
        news = storage.select((row) => row.authorid in idlist,storage.news).map((post)=>{
            //console.log("author "+post.authorid)
            let author = list.find((u)=>u.id===post.authorid)
            if(!author) return
            if(!showall && author.status==="banned") return
            if(!showall && post.available!==true) return
            return {id: post.id,
                    authorid: post.authorid,
                    firstname: author.firstname,
                    lastname: author.lastname,
                    avatar: author.avatar,
                    available:post.available,
                    authorBanned:author.status==="banned",
                    date: post.date,
                    content: post.content
            }
        }).filter((x)=>x!==undefined).sort((a,b)=>new Date(b.date)-new Date(a.date))
        console.log(news)
    }
    res.end(JSON.stringify({news: news,name:name}))
})


router.get('/users/options', (req, res) => {
    res.end(JSON.stringify(ru))
})
router.get('/users/template', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname+"/views/partials/usersTemplate.ejs")
})

router.post('/users/edit', (req, res) => {
    let newuser=req.body
    //console.log(newuser)
    storage.update(newuser,(r)=>r.id===newuser.id,storage.users)
    res.end(JSON.stringify({user: storage.select((r) => r.id===newuser.id, storage.users).map(userConverter)[0]}))
})
router.post('/news/edit', (req, res) => {
    let post=req.body
    storage.update(post,(row)=>row.id===post.id,storage.news)
    res.end(JSON.stringify(post))
})

export default router