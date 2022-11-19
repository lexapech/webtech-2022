import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Subject} from "rxjs";
import Message from "../model/user/Message";
import Post from "../model/user/Post";

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  message$ : Subject<Message>
  messageRead$ : Subject<Message>

  postRecieved$ : Subject<Post>

  connected:boolean=false;
  constructor(private socket: Socket) {
    console.log("create 1")
    this.message$=new Subject<Message>();
    this.messageRead$=new Subject<Message>();
    this.postRecieved$ =  new Subject<Post>();
    //this.message$.subscribe(x=>)
  }
  login() {
    if( this.message$.closed) {
      console.log("create 2")
      this.message$ = new Subject<Message>();
    }
    if( this.messageRead$.closed) {
      this.messageRead$=new Subject<Message>();
    }
    if( this.postRecieved$.closed) {
      this.postRecieved$=new Subject<Post>();
    }
    if(this.connected) return
    this.socket.connect()
    this.connected=true;
      this.socket.on("user_message",(x:Message)=>{
        this.message$.next(x)
      })
    this.socket.on("message_read",(x:Message)=>{
      this.messageRead$.next(x)
    })
    this.socket.on("post_receive",(x:Post)=>{
      this.postRecieved$.next(x)
    })
      this.socket.on("disconnect",(x:Message)=>{
        console.log("disconnected");
        this.connected=false;
        this.socket.removeAllListeners()
    })
  }
  logout() {
    this.connected=false;
    this.socket.disconnect()
    this.message$.unsubscribe()
    //TODO: ????
    this.messageRead$.unsubscribe()

    this.postRecieved$.unsubscribe()
  }

  subPosts(sub:boolean) {
    this.socket.emit('post_receive', sub);
  }


  sendMessage(msg:Message) {
    this.socket.emit('user_message', msg);
  }

  confirmMessage(msg:Message) {
    this.socket.emit('message_read', {id:msg.id,from:msg.from});
  }

  get message(){

    return this.message$
  }
  get messageRead(){

    return this.messageRead$
  }

}
