import { Injectable } from '@angular/core';
import {map, Observable, Subscription, tap} from "rxjs";
import {SocketsService} from "./sockets.service";
import {HttpClient} from "@angular/common/http";
import AppSettings from "../AppSettings";
import Message from "../model/user/Message";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  subscriptions: Subscription[]=[]
  constructor(private http: HttpClient,private socketsService : SocketsService) { }

  sendMessage(recipient:string,msg: string) {
      this.socketsService.sendMessage({to:recipient,content:msg,from:"",read:false,timestamp:null,id:null})
  }
  setMessageListener(listener:Function,id:string) {
    this.subscriptions.push(this.socketsService.message.subscribe(message=>{
      if(!message.read &&message.from===id) {
        this.socketsService.confirmMessage(message)
      }
      listener(message)
    }))
    //return this.socket.on('message',listener);
  }
  setReadListener(listener:Function) {
    this.subscriptions.push(this.socketsService.messageRead.subscribe(message=>{
      listener(message)
    }))
    //return this.socket.on('message',listener);
  }

  getMessages(id:string):Observable<Message[]> {
    return this.http.get<any>(AppSettings.API_ENDPOINT+`dialog?id=${id}`).pipe(map(x=>x.messages)).pipe(tap(x=>{
      for(let m of x) {
        if(!m.read && m.from===id) {
          this.socketsService.confirmMessage(m)
        }
      }
    }))
  }

  destroy(){
    for(let sub of this.subscriptions)
      sub.unsubscribe()
  }


}
