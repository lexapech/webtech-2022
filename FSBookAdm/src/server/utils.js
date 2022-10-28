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
        return petrovich(person, 'genitive').first;
    }
    return null;
}


export {getGenitive}
export {friendInfo}
export {userConverter}
export {search}