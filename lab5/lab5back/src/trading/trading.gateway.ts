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
        origin: "http://localhost:3000"
    }
})
export class TradingGateway {

    @WebSocketServer()
    server: any;

    constructor(private tradingService: TradingService) {

    }

    @SubscribeMessage('start')
    startTrading(@ConnectedSocket() socket:any, @MessageBody() data: StartTradingDTO){
        this.tradingService.startTrading(data.startDate,data.speed,data.stocks,(data)=>this.update(data))
    }

    update(data:StocksUpdateDTO) {
        for(let socket of Array.from(this.server.sockets.sockets.values()) as Socket[]) {
            socket.emit('update',data)
        }

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