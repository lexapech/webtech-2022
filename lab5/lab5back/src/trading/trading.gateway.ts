import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import {Socket} from "socket.io-client";
import {StocksUpdateDTO, TradingService} from "./trading.service";

export interface ITradingStock{
    code:string,
    name:string,
    price:number,
    change:number
}

interface StartTradingDTO {
    startDate:string,
    speed:number,
    stocks:{code: string, active: boolean}[]
}




@WebSocketGateway({
    cors: {
        origin: "*"
    },
    allowEIO3:true
})
export class TradingGateway {

    @WebSocketServer()
    server: any;

    constructor(private tradingService: TradingService) {

    }
    @SubscribeMessage('username')
    loginUser(@ConnectedSocket() socket:any, @MessageBody() data: string){
        socket.username = data
    }
    @SubscribeMessage('operation')
    operation(@ConnectedSocket() socket:any, @MessageBody() data: { code:string,quantity:number }){
        this.tradingService.operation(socket.username,data.code,data.quantity)
    }


    @SubscribeMessage('start')
    startTrading(@ConnectedSocket() socket:any, @MessageBody() data: StartTradingDTO){
        this.tradingService.startTrading(data.startDate,data.speed,data.stocks,(data)=>this.update(data))
    }

    update(data:StocksUpdateDTO) {
        for(let socket of Array.from(this.server.sockets.sockets.values()) as Socket[]) {
            socket.emit('update',data)
            // @ts-ignore
            if(socket.username) {
                // @ts-ignore
                socket.emit('userinfo',this.tradingService.getBrokerInfo(socket.username))
            }
        }

    }

    @SubscribeMessage('stock')
    getStock(@ConnectedSocket() socket:any, @MessageBody() data: string){
        return this.tradingService.getStockInfo(data)
    }

    @SubscribeMessage('brokers')
    getBrokers(){
        return this.tradingService.getBrokers()
    }

    @SubscribeMessage('status')
    getStatus():string{
        return this.tradingService.getStatus()
    }

    @SubscribeMessage('stop')
    stopTrading(){
        this.tradingService.stopTrading()
    }

}