import {ConsoleLogger, Injectable} from '@nestjs/common';
import DatabaseService from "../database.service";
import {StocksService} from "../stocks/stocks.service";
import {ITradingStock} from "./trading.gateway";

export interface StocksUpdateDTO {
    last:boolean
    open:boolean
    date:string,
    stocks:ITradingStock[]
}


@Injectable()
export class TradingService {
    currentDate: Date|undefined
    prevStocks:ITradingStock[]=[]
    activeStocks:string[]=[]
    stockNames:Object={}
    started: boolean = false
    timer: NodeJS.Timer
    constructor(private consoleLogger:ConsoleLogger,private stocksService: StocksService,private databaseService:DatabaseService) {
        let stocks = this.databaseService.select(()=>true,this.databaseService.tables['stocks']) as {"id","code","name","active"}[]
        for(let stock of stocks) {
            this.stockNames[stock.code]=stock.name
        }
    }
    getStatus(){
        return this.started?"running":"stopped"
    }
    stopTrading(){
        clearInterval(this.timer)
        this.activeStocks=[]
        this.currentDate=undefined
        this.started=false
    }

    saveStocksState(tradingStocks: {code:string,active:boolean}[]) {
        for(let stock of tradingStocks) {
            this.databaseService.update({active: stock.active}, (row)=>row.code===stock.code,this.databaseService.tables['stocks'])
        }
    }

    startTrading(startDateString:string,speed:number,tradingStocks: {code:string,active:boolean}[],updateCallback:Function){
        speed = Math.round(speed)
        let dateRange = this.stocksService.getDateRange()
        let startDate = new Date(startDateString)
        if(speed>0 && !isNaN(startDate.getTime()) && startDate>=dateRange.min && startDate<=dateRange.max) {
            this.saveStocksState(tradingStocks)
            this.activeStocks = tradingStocks.filter(x=>x.active).map(x=>x.code)
            this.started = true
            this.currentDate = startDate
            this.update(updateCallback)
            this.timer = setInterval(() => this.update(updateCallback), speed * 1000)
        }
    }
    update(updateCallback:Function) {

        let stocks = this.stocksService.getStocksAtDate(this.currentDate,this.activeStocks)
        let tradingStocks:ITradingStock[]=[]
        if (stocks) {
            for(let stock of stocks) {
                let t=this.prevStocks.find(x=>x.code===stock.code)
                let prevPrice = t?t.price:0
                tradingStocks.push({
                    code:stock.code,
                    name:this.stockNames[stock.code],
                    price:stock.open,
                    change:stock.open-prevPrice
                })
            }
        }
        else
            tradingStocks.push(...this.prevStocks)
        this.prevStocks=tradingStocks
        let dto: StocksUpdateDTO = {open:stocks!==null,last:false,date:this.currentDate.toISOString(),stocks:tradingStocks}

        if(this.currentDate.toISOString()===this.stocksService.getDateRange().max.toISOString()) {
            dto.last=true
            updateCallback(dto)
            this.stopTrading()
            return
        }
        updateCallback(dto)
            this.currentDate.setDate(this.currentDate.getDate() + 1)
    }

}