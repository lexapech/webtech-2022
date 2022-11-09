import express from 'express'
import {storage} from "../app.js";
import {userConverter, getGenitive, getUserInfo, userFriendInfo, postConverter} from "../utils.js";
import * as url from "url";
import {userAuth} from "./auth.js";
import path from "path";

let images = url.fileURLToPath(new URL('../../../public', import.meta.url));

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

router.post('/news',userAuth,(req, res) => {
    let filename=null
    if(req.files) {
        filename=req.files.image.md5+req.files.image.name.slice(req.files.image.name.lastIndexOf('.'))

        req.files.image.mv(path.resolve(images,filename))
    }
    storage.insert({
            authorid:req.user.id,
            available:true,
            date:new Date(Date.now()).toISOString(),
            content:{image:filename,
            text: req.body.text}}
        ,storage.news);

    console.log(filename)
    res.end(JSON.stringify({status:"ok"}))
})



router.get('/news',userAuth ,(req, res) => {

    if(req.query.id) {
        let id = req.query.id
        let news=[]
        let author = storage.select((row)=>row.id===id,storage.users)[0]
        news = storage.select((row) => row.authorid === id,storage.news).map((post)=>{
            if(!author) return
            if(author.status==="banned") return
            if(post.available!==true) return
            return {id: post.id,
                authorid: post.authorid,
                firstname: author.firstname,
                lastname: author.lastname,
                avatar: author.avatar,
                available:post.available,
                date: post.date,
                content: postConverter(post.content)
            }
        }).filter((x)=>x!==undefined).sort((a,b)=>new Date(b.date)-new Date(a.date))
        res.end(JSON.stringify({news: news}))
    }
    else {
        let id = req.user.id
        let news=[]

        let temp = storage.select((row) => row.user1===id || row.user2===id, storage.friends)
        let list = storage.select((row) => temp.find((t)=>row.id===t.user1 || row.id===t.user2), storage.users).map(userConverter)
        let idlist = list.map((x)=>x.id)
        news = storage.select((row) => row.authorid in idlist,storage.news).map((post)=>{
            //console.log("author "+post.authorid)
            let author = list.find((u)=>u.id===post.authorid)
            if(!author) return
            if(author.status==="banned") return
            if(post.available!==true) return
            return {id: post.id,
                authorid: post.authorid,
                firstname: author.firstname,
                lastname: author.lastname,
                avatar: author.avatar,
                available:post.available,
                date: post.date,
                content: postConverter(post.content)
            }
        }).filter((x)=>x!==undefined).sort((a,b)=>new Date(b.date)-new Date(a.date))
        res.end(JSON.stringify({news: news}))
    }
})



router.get('/dialog',userAuth ,(req, res) => {
    if(req.query.id) {
        let id1 = req.query.id.toString()
        let id2 = req.user.id.toString()
        console.log(id1,id2)
        let list = storage.select((row) => (row.from===id1 && row.to===id2) || (row.from===id2 && row.to===id1), storage.messages)
        res.end(JSON.stringify({messages:list}))
    }
    else {
        let id = req.user.id
        let list = storage.select((row) => row.from===id || row.to===id, storage.messages).sort((a,b)=>b.timestamp-a.timestamp)
        let filtered=[]

        for(let m of list) {
            if(m.from===id) {
                if(!filtered.find(x=>x.from===m.to ||x.to===m.to))
                    filtered.push(m)
            }
            else {
                if(!filtered.find(x=>x.from===m.from ||x.to===m.from))
                    filtered.push(m)
            }
        }
        filtered=filtered.sort((a,b)=>b.timestamp-a.timestamp)

        filtered=filtered.map(x=>{
            let user=x.from===id?x.to:x.from
            return {user:storage.select((row) => row.id===user, storage.users).map(userConverter).map(getUserInfo)[0],message:x}
        })
        res.end(JSON.stringify({dialogs:filtered}))
    }
})


export default router