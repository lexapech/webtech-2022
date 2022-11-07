import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {
  avatar:string="https://sun9-6.userapi.com/s/v1/ig2/uZm621aJXpySeIsZD7JwCjs2LG2Q12ctGiozOg6-i70QoziU_L6s38vrlKe34uQp66Vs_KSxFrsEXyKbvuH4ZLQt.jpg?size=200x200&quality=96&crop=224,1,764,764&ava=1"
  users :{avatar:string,name:string,message:string}[]= []
  constructor() {
    this.users.push({avatar:this.avatar,name:"гы",message:"succ"})
    this.users.push({avatar:this.avatar,name:"б",message:"cocck"})
    this.users.push({avatar:"http://localhost:3000/CF96EAF0-6EEF-4BE1-B573-1D56AB447F5C.jpg",name:"CockMaster",message:"Hi, wanna suck my big cock?"})
  }

  ngOnInit(): void {
  }

}
