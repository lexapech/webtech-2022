import ru from '../../data/ru.json' assert {type:'json'}
import {storage} from "./app.js";
import petrovich from "petrovich";

let userConverter = (obj)=>{
    let res={}
    for (let key in obj) {
        /*if (key in ru) {
            if (obj[key] in ru[key])
                res[key]= ru[key][obj[key]]
            else
                res[key]= ru['default']
        }
        else*/ if (key === "avatar") {
            res[key] = (obj[key] === null) ? "user.jpg" : obj[key];
        }
        else {
            res[key] = (obj[key] === null) ? "" : obj[key];
        }
    }
    return res
}

let userConverter2 = (obj)=>{
    let res={}
    for (let key in obj) {
        if (key in ru) {
            if (obj[key] in ru[key])
                res[key]= ru[key][obj[key]]
            else
                res[key]= ru['default']
        }
        else {
            res[key] = (obj[key] === null) ? "" : obj[key];
        }
    }
    return res
}


let search = (row,pattern) => {
    let newrow = userConverter2(row)
    for(let attr of Object.keys(row)) {
        if (attr==="id" ||attr==="avatar") continue
        if (newrow[attr] && newrow[attr].search(new RegExp(pattern,'i'))>=0) return true
    }
    return false
}

let createUser =(user) => {
    return {
        firstname: user.firstname,
        midname: user.midname,
        lastname: user.lastname,
        birthday: user.birthday,
        email: user.email,
        avatar: null,
        role: "user",
        status: "unverified"
    }
}

let postConverter =(content) =>{
    return {
        text:content.text,
        image: content.image?  content.image.startsWith("http")?content.image: 'http://localhost:3000/'+ content.image: null
    }
}

let getPost = (post,author) => {
    if(!author) return
    if(author.status==="banned") return
    if(post.available!==true) return
    return {id: post.id,
        authorid: post.authorid,
        firstname: author.firstname,
        lastname: author.lastname,
        avatar: !author.avatar?"http://localhost:3000/user.jpg":( author.avatar.startsWith("http")?author.avatar: 'http://localhost:3000/'+ author.avatar),
        available:post.available,
        date: post.date,
        content: postConverter(post.content)
    }
}



let getUserInfo =(user) => {
    return {
        id:user.id,
        firstname: user.firstname,
        midname: user.midname,
        lastname: user.lastname,
        birthday: user.birthday,
        avatar: user.avatar.startsWith("http")?user.avatar: 'http://localhost:3000/'+ user.avatar,
        status: user.status,
        genitive: petrovich({
            first: user.firstname,
            middle: user.midname,
            last: user.lastname
        }, 'genitive')
    }
}
let userFriendInfo = (userInfo) => {
    return {id:"id"+userInfo.id,
        firstname:userInfo.firstname,
        lastname: userInfo.lastname,
        avatar: userInfo.avatar.startsWith("http")?userInfo.avatar: 'http://localhost:3000/'+ userInfo.avatar}
}

let friendInfo = (userInfo) => {
    return {id:userInfo.id,firstname:userInfo.firstname,lastname:userInfo.lastname,avatar:userInfo.avatar,banned: userInfo.status==='banned'}
}

let getGenitive = (id) => {
    let user = storage.select((row) => row.id===id, storage.users)[0]
    if(user) {
        let person = {
            first: user.firstname,
            middle: user.midname,
            last: user.lastname
        };
        return petrovich(person, 'genitive');
    }
    return null;
}

export {search,getUserInfo,userFriendInfo,userConverter,friendInfo,getGenitive,createUser, postConverter,getPost}