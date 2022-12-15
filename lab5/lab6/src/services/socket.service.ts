import SocketIO, {Socket} from "socket.io-client";

 class SocketService {

    socketConnection:Socket

    constructor() {
        this.socketConnection = SocketIO('http://localhost:3100',{withCredentials: false,autoConnect:false});
    }
    connect(login:string){
        this.socketConnection.connect()
        this.socketConnection.on('connect',()=>{
            this.socketConnection.emit('username',login)
        })

    }


    stocks(func:Function){
        this.socketConnection.on('update',(data)=>func(data))
    }
     userinfo(func:Function){
         this.socketConnection.on('userinfo',(data)=>func(data))
     }

    disconnect(){
        this.socketConnection.disconnect()
    }
}
export default new SocketService()