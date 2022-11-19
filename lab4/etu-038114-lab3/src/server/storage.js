import fs from "fs";
import users from "../../data/user.json" assert {type: "json"}
import friends from "../../data/friends.json" assert {type: "json"}
import news from "../../data/news.json" assert {type: "json"}
import credentials from "../../data/credentials.json" assert {type: "json"}
import messages from "../../data/message.json" assert {type: "json"}
import pending from "../../data/pending.json" assert {type: "json"}
import test from "../../data/test.json" assert {type: "json"}
class Storage {
    constructor() {
        this.users=users
        this.friends = friends
        this.news = news
        this.credentials = credentials
        this.messages = messages
        this.pending = pending
        this.test = test
    }

    writeJson(obj, file) {

        fs.writeFileSync('data/' + file+'.json', JSON.stringify(obj), 'utf8')
    }

    insert(data,into) {
        let newrow={}
        into.attrib.forEach((a)=>newrow[a]=(data[a]!==undefined)?data[a]:null)
        let newId=1
        while (into.data.find((x) => x.id === newId.toString())!==undefined) {newId++}
        newrow.id=newId.toString()
        into.data[into.data.length] = newrow
        this.writeJson(into,into.table_name)
        return newrow
    }

    select(where, from) {
        return from.data.filter(where)
    }

    delete(where, from) {
        from.data=from.data.filter((row)=>!where(row))
        this.writeJson(from,from.table_name)
    }
    update(data,where, table) {
        let row = table.data.find(where)
        if (!row) return
        table.attrib.forEach((a)=>row[a]=data[a]!==undefined?data[a]:row[a])
        this.writeJson(table,table.table_name)
    }

}

export default Storage