import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Message from "../model/user/Message";
import AppSettings from "../AppSettings";
import UserInfo from "../model/user/UserInfo";
import {Subject} from "rxjs";
import {SocketsService} from "./sockets.service";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  update$ :Subject<{dialogs:{user:UserInfo,message:Message}[]}>
  constructor(private http: HttpClient,private socketsService:SocketsService ) {
    this.update$=new Subject<{dialogs: {user: UserInfo; message: Message}[]}>()
    socketsService.messageRead$.subscribe(x=>{
      this.getDialogs()
    })
    socketsService.message.subscribe(x=>{
      this.getDialogs()
    })
  }



  getDialogs(){
    this.http.get<{dialogs:{user:UserInfo,message:Message}[]}>(AppSettings.API_ENDPOINT+`dialog`).subscribe(x=>this.update$.next(x))
  }



  get update() {
    return this.update$
  }
}
