import {ConsoleLogger, Injectable} from '@nestjs/common';
import DatabaseService from "../database.service";
import * as fs from "fs";
import * as path from "path";

interface StockData {
    "code":string,
    "date": string,
    "close": number,
    "open": number
}


@Injectable()
export class StocksService {
    stocksData: Object = {}
    dateRange:{min:Date|undefined,max:Date|undefined} = {min:undefined,max:undefined}
    constructor(private consoleLogger:ConsoleLogger,private databaseService: DatabaseService) {
        consoleLogger.setContext(this.constructor.name)
        this.loadFiles()
        let stockData = this.stocksData[Object.keys(this.stocksData)[0]]
        stockData=stockData.map(this.convertDate)
        let min=Date.now()
        let max=new Date(0)
        for (let date of stockData) {
            if(date>max) max=date
            if(date<min) min=date
        }
        this.dateRange.min=new Date(min)
        this.dateRange.max=new Date(max)
        this.consoleLogger.log("Got available date range: "+this.dateRange.min.toLocaleDateString()+" - "+this.dateRange.max.toLocaleDateString())
    }

    convertDate = (x:{Date:string}) =>{
        let segs = x.Date.split('/')
        return new Date(`${segs[2]}-${segs[0]}-${segs[1]}`).getTime()
    }

    getStocksAtDate(date:Date,active:string[]) {
        let dateString = date.toLocaleDateString('en-US')
        let segs = dateString.split('/')
        if(segs[0].length===1) segs[0]='0'+segs[0]
        if(segs[1].length===1) segs[1]='0'+segs[1]
        dateString=`${segs[0]}/${segs[1]}/${segs[2]}`
        console.log(dateString)
        let convertedDate = this.convertDate({Date:dateString})
        let stocks:StockData[]=[]
        for(let stockKey of Object.keys(this.stocksData) ) {
            if (!active.find(x=>x===stockKey)) continue
            let stock = this.stocksData[stockKey] as {Date:string,Open:string,Close:{Last:string}}[]
            let day = stock.find(x=>x.Date===dateString)
            if(!day) return null;
            stocks.push({date: new Date( convertedDate).toISOString(),
                open: +(day.Open.replace('$','')),
                close: +(day.Close.Last.replace('$','')),
                code:stockKey
            })
        }
        return stocks
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

    getDateRange() {
        return this.dateRange
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