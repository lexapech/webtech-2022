import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  avatar:string="https://sun9-6.userapi.com/s/v1/ig2/uZm621aJXpySeIsZD7JwCjs2LG2Q12ctGiozOg6-i70QoziU_L6s38vrlKe34uQp66Vs_KSxFrsEXyKbvuH4ZLQt.jpg?size=200x200&quality=96&crop=224,1,764,764&ava=1"
  @Input('Profile') isMine:boolean=false
  @Input('UserId') id:string=""
  constructor() {

  }

  ngOnInit(): void {

  }

}
