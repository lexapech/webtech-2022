import { Server } from "socket.io";
import { createServer } from 'http'
import {socketAuth} from "./routes/auth.js";
import {storage} from "./app.js"

export default class SocketServer {

    constructor() {
        let server = createServer()
        this.io = new Server(server, {
            cors: {
                origin: true,
                methods: ["GET", "POST"],
                credentials: true
            }
        })

        this.io.use(socketAuth)

        this.io.on('connection', (socket) => {

            socket.on('user_message', (message) => {
                message.timestamp = Date.now()
                message.from=socket.user.id
                message.read=false
                message.id=storage.insert(message,storage.messages).id
                let clients = Array.from(this.io.sockets.sockets.values())
                let client = clients.find((x) => x.user.id === message.to)
                if(client) {
                    client.emit("user_message", message)
                }
                socket.emit("user_message", message)
            });
            socket.on('message_read', (message) => {
                storage.update({read:true},(x)=>x.id===message.id,storage.messages)
                let clients = Array.from(this.io.sockets.sockets.values())
                let client = clients.find((x) => x.user.id === message.from)
                if(client) {
                    client.emit("message_read", message)
                }
            });
            socket.on('disconnect', () => {
                console.log("Users online "+this.getConnected().length);
            });
            console.log("Users online "+this.getConnected().length);
        });

        server.listen(3100, () => {
            console.log('listening on port 3100');
        });
    }

    getConnected() {
        return Array.from(this.io.sockets.sockets.values()).map(x=>x.user.id)
    }

}