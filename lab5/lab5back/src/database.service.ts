import * as fs from "fs";
import {Injectable} from "@nestjs/common";
import * as path from "path";
import { ConsoleLogger } from '@nestjs/common';

@Injectable()
export default class DatabaseService {
    tables: Object=[]
    constructor(private consoleLogger:ConsoleLogger) {
        consoleLogger.setContext(this.constructor.name)
        this.loadFiles()
    }

    loadFiles() {
        let files  = fs.readdirSync('data/application')
        files.forEach(filename=>{
            try {
                this.tables[filename.split('.')[0]] = JSON.parse(fs.readFileSync(path.resolve('data/application', filename)).toString())
                this.consoleLogger.log(filename+" loaded successfully")
            }
            catch (e){
                this.consoleLogger.error("Couldn't load "+filename+"\n"+e)
            }
        })

    }

    writeJson(obj, file) {

        fs.writeFileSync('data/application' + file+'.json', JSON.stringify(obj,null,1), 'utf8')
    }

    insert(data,into) {
        let newrow:any={}
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