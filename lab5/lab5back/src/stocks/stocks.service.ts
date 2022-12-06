import {ConsoleLogger, Injectable} from '@nestjs/common';
import DatabaseService from "../database.service";
import * as fs from "fs";
import * as path from "path";

interface StockData {
    "date": string,
    "close": number,
    "open": number
}


@Injectable()
export class StocksService {
    stocksData: Object = {}
    constructor(private consoleLogger:ConsoleLogger,private databaseService: DatabaseService) {
        consoleLogger.setContext(this.constructor.name)
        this.loadFiles()
    }

    loadFiles() {
        let files  = fs.readdirSync('data/stocks')
        files.forEach(filename=>{
            try {
                this.stocksData[filename.split('.')[0]] = JSON.parse(fs.readFileSync(path.resolve('data/stocks', filename)).toString())
                this.consoleLogger.log(filename+" loaded successfully")
            }
            catch (e){
                this.consoleLogger.error("Couldn't load "+filename+"\n"+e)
            }
        })

    }

    getAll() {
        return this.databaseService.select(()=>true,this.databaseService.tables['stocks'])
    }
    getDetails(code:string):StockData[]|null {
        if(this.stocksData[code])
            return this.stocksData[code].filter((x,i)=>i%22===0).map(x=>{
                return {
                    date: new Date(x.Date).toLocaleDateString(),
                    open: +(x.Open.replace('$','')),
                    close: +(x.Close.Last.replace('$',''))
                }
            }).reverse()
        return null
    }
}