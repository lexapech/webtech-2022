import SocketIO, {Socket} from "socket.io-client";

 class SocketService {

    socketConnection:Socket

    constructor() {
        this.socketConnection = SocketIO('http://localhost:3100',{withCredentials: false,autoConnect:false});
    }
    connect(login:string,cb:Function){
        this.socketConnection.connect()
        this.socketConnection.on('connect',()=>{
            console.log('connected')
            this.socketConnection.emit('username',login)
            this.socketConnection.emit('status',(x:string)=>{
                cb(x)
            })
        })

    }
     brokers(func:Function){
         this.socketConnection.on('brokers',(data)=>func(data))
     }

    stocks(func:Function){
        this.socketConnection.on('update',(data)=>func(data))
    }
     userinfo(func:Function){
         this.socketConnection.on('userinfo',(data)=>func(data))
     }

    disconnect(){
        this.socketConnection.off('update')
        this.socketConnection.off('userinfo')
        this.socketConnection.off('connect')
        this.socketConnection.disconnect()
    }
}
export default new SocketService()