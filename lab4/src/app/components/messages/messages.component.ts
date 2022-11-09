import { Component, OnInit } from '@angular/core';
import Message from "../../model/user/Message";
import UserInfo from "../../model/user/UserInfo";
import {MessagesService} from "../../services/messages.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {
  dialogs:{user:UserInfo,message:Message}[]=[]
  constructor(private messagesService:MessagesService) {

  }

  ngOnInit(): void {
      this.messagesService.getDialogs().subscribe(x=>{
        this.dialogs=[]
        this.dialogs.push(...x.dialogs)
      })
  }

}
