import { Server } from "socket.io";
import { createServer } from 'http'
import {socketAuth} from "./routes/auth.js";
import {storage} from "./app.js"

export default class SocketServer {

    postSubscribers=[]

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

            socket.on('post_receive', (message) => {
                if(message) {
                    let temp = storage.select((row) => row.user1===socket.user.id || row.user2===socket.user.id, storage.friends)
                    socket.listen=temp.map(row=>row.user1===socket.user.id?row.user2:row.user1)
                    socket.listen.push(socket.user.id)
                    this.postSubscribers.push(socket)
                    console.log("subscribed")
                }
                else {
                    this.postSubscribers=this.postSubscribers.filter(sub=>sub.user.id!==socket.user.id)
                    console.log("unsubscribed")
                }
            });

            socket.on('disconnect', () => {
                console.log("Users online "+this.getConnected().length);
                this.postSubscribers=this.postSubscribers.filter(sub=>sub.user.id!==socket.user.id)
            });
            console.log("Users online "+this.getConnected().length);
        });

        server.listen(3100, () => {
            console.log('listening on port 3100');
        });
    }

    sendPost(post) {
        let subs = this.postSubscribers.filter(x=>x.listen.find(x=>x===post.authorid))
        for (let sub of subs) {
            sub.emit('post_receive',post)
        }
    }


    getConnected() {
        return Array.from(this.io.sockets.sockets.values()).map(x=>x.user.id)
    }

}