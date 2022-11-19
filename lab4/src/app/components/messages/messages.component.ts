import { Component, OnInit } from '@angular/core';
import Message from "../../model/user/Message";
import UserInfo from "../../model/user/UserInfo";
import {MessagesService} from "../../services/messages.service";
import {NotificationComponent} from "../notification/notification.component";
import {Subscription} from "rxjs";
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {
  dialogs:{user:UserInfo,message:Message}[]=[]
  constructor(private messagesService:MessagesService,private profileService :ProfileService) {

  }
  userInfo:UserInfo = new UserInfo()
  message:Subscription|undefined;
  ngOnInit(): void {
      this.profileService.getUserInfo("").subscribe(x=>{
        this.userInfo=x
      })

      this.messagesService.update.subscribe(x=>{
        this.dialogs=[]
        this.dialogs.push(...x.dialogs)
      })
    this.messagesService.getDialogs()

  }

  getClasses(dialog:{user:UserInfo,message:Message}) {
    let unread = !dialog.message.read
    return {'unread-my':unread}
  }

}
