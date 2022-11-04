import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  avatar="https://sun9-6.userapi.com/s/v1/ig2/uZm621aJXpySeIsZD7JwCjs2LG2Q12ctGiozOg6-i70QoziU_L6s38vrlKe34uQp66Vs_KSxFrsEXyKbvuH4ZLQt.jpg?size=200x200&quality=96&crop=224,1,764,764&ava=1"
  friends:number[]=[]
  constructor() {
    this.friends = Array.from(Array(10).keys())
  }

  ngOnInit(): void {
  }

}
