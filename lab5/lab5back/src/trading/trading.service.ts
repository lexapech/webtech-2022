import {ConsoleLogger, Injectable} from '@nestjs/common';
import DatabaseService from "../database.service";
import {StocksService} from "../stocks/stocks.service";
import {ITradingStock} from "./trading.gateway";
import {BrokersService} from "../brokers/brokers.service";

export interface StocksUpdateDTO {
    last:boolean
    open:boolean
    date:string,
    stocks:ITradingStock[]
}


@Injectable()
export class TradingService {
    currentDate: Date|undefined
    startDate:Date|undefined
    prevStocks:ITradingStock[]=[]
    activeStocks:string[]=[]
    stockNames:Object={}
    started: boolean = false
    timer: NodeJS.Timer
    brokers:{
        name:string,
        funds:number,
        stocks: {
            code:string,
            amount:number,
            buyPrice:number
        }[]
    }[]
    constructor(private consoleLogger:ConsoleLogger,
                private stocksService: StocksService,
                private databaseService:DatabaseService,
                private brokersService:BrokersService) {
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
        this.startDate=undefined
        this.currentDate=undefined
        this.started=false
    }

    saveStocksState(tradingStocks: {code:string,active:boolean}[]) {
        for(let stock of tradingStocks) {
            this.databaseService.update({active: stock.active}, (row)=>row.code===stock.code,this.databaseService.tables['stocks'])
        }
    }

    initBrokers(){
        let brokers = this.brokersService.getAll()
        this.brokers = brokers.map(x=>{
            return {
                name: x.name,
                funds:x.funds,
                stocks:[]
            }
        })
    }

    getBrokerInfo(brokerName:string) {
        let broker = this.brokers.find(x => x.name === brokerName)
        if(broker) {
            let sum=0
            let currentPrices = this.stocksService.getStocksAtDate(this.currentDate, broker.stocks.map(x=>x.code))
            let profit = currentPrices.map(x=>{
                return { code:x.code,
                profit:x.open - broker.stocks.find(s=>s.code===x.code).buyPrice}})
            currentPrices.forEach(x=>{
                sum+=x.open
            })
            let res = broker.stocks.map(x=>{
                return {
                    code: x.code,
                    amount: x.amount,
                    price: currentPrices.find(t=>t.code===x.code).open,
                    profit: profit.find(t=>t.code===x.code).profit
                }
            })
            return {
                name:broker.name,
                funds:broker.funds,
                total:sum,
                stocks:res
            }
        }
    }

    getBrokers() {
        return this.brokers
    }

    getBrokerFunds(name:string) {
        return this.brokers.find(x=>x.name===name)?.funds
    }

    operation(brokerName: string,code:string,amount:number) {
        let broker = this.brokers.find(x => x.name === brokerName)
        if (broker) {
            let stock = broker.stocks.find(st=>st.code===code)
            if(stock){
                if(stock.amount + amount < 0 ) {

                }
                else if(stock.amount + amount ===0) {
                    broker.stocks=broker.stocks.filter(x=>x.code!==code)
                }
                else {
                    stock.amount+=amount
                }

            }
            else {
                if(amount>0) {
                    broker.stocks.push({code:code,amount:amount,buyPrice:this.prevStocks.find(x=>x.code===code).price})
                }
            }
        }
    }

    getStockInfo(code:string):any{
        return this.stocksService.getRange(code,this.startDate.toISOString(),this.currentDate.toISOString())
    }


    startTrading(startDateString:string,speed:number,tradingStocks: {code:string,active:boolean}[],updateCallback:Function){
        speed = Math.round(speed)
        let dateRange = this.stocksService.getDateRange()
        let startDate = new Date(startDateString)
        if(speed>0 && !isNaN(startDate.getTime()) && startDate>=dateRange.min && startDate<=dateRange.max) {
            this.saveStocksState(tradingStocks)
            this.activeStocks = tradingStocks.filter(x=>x.active).map(x=>x.code)
            this.started = true
            this.startDate = new Date(startDate)
            this.currentDate = startDate
            this.initBrokers()
            this.update(updateCallback)
            this.timer = setInterval(() => this.update(updateCallback), speed * 100)
        }
    }
    update(updateCallback:Function) {
        let stocks=null;
        while(true) {
             stocks = this.stocksService.getStocksAtDate(this.currentDate, this.activeStocks)
            if (!stocks) this.currentDate.setDate(this.currentDate.getDate() + 1)
            else break
        }
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
        let dto: StocksUpdateDTO = {open:true,last:false,date:this.currentDate.toISOString(),stocks:tradingStocks}

        if(this.currentDate.toISOString()===this.stocksService.getDateRange().max.toISOString()) {
            dto.last=true
            updateCallback(dto)
            this.stopTrading()
            return
        }
        if(stocks)
            updateCallback(dto)
        this.currentDate.setDate(this.currentDate.getDate() + 1)
    }

}