import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Message from "../model/user/Message";
import AppSettings from "../AppSettings";
import UserInfo from "../model/user/UserInfo";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient ) {}

  getDialogs(){
    return this.http.get<{dialogs:{user:UserInfo,message:Message}[]}>(AppSettings.API_ENDPOINT+`dialog`)
  }
}
