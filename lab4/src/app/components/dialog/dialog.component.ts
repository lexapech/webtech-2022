import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import {Location} from "@angular/common";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent implements OnInit, AfterViewInit, OnChanges {
  messageText:string=""
  @ViewChild("scroll") scroll!: ElementRef
  @ViewChildren("msglist") msglist!: QueryList<ElementRef>
  avatar:string="https://sun9-6.userapi.com/s/v1/ig2/uZm621aJXpySeIsZD7JwCjs2LG2Q12ctGiozOg6-i70QoziU_L6s38vrlKe34uQp66Vs_KSxFrsEXyKbvuH4ZLQt.jpg?size=200x200&quality=96&crop=224,1,764,764&ava=1"
  user : {avatar:string,name:string,message:string}
  messages:{text:string,mine:boolean}[]=[]


  constructor(private location: Location) {
    this.user = {avatar:"https://sun9-26.userapi.com/s/v1/ig2/82QRxyKCctxy65RSVdSsLPiCuzRi9xOnTdrtU6eXKt-3sncQqK8i3a2JmDICyDBl867EJRpDD_j4McHQU3EpLJRB.jpg?size=50x50&quality=95&crop=202,186,603,603&ava=1",name:"CockMaster",message:"Hi, wanna suck my big cock?"}
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"dikx",mine:true});
    this.messages.push({text:"you",mine:true});
    this.messages.push({text:"bitch",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"SUCKKKDS",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"FUCK",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"dikx",mine:true});
    this.messages.push({text:"you",mine:true});
    this.messages.push({text:"bitch",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"SUCKKKDS",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"FUCK",mine:true});
    this.messages.push({text:"suck",mine:true});
    this.messages.push({text:"suckThis is very big messge this message is so big that it could not fit into the screnn or could it? Ш вщте лрщц, i will know it when i finish typing this message and see how it look in the browser",mine:false});

  }

  back() :void {
    this.location.back()
  }

  sendMessage(): void {
    this.messages.push({text:this.messageText,mine:true})
    console.log(this.messageText)
  }

  scrollDown():void {
    if(this.scroll) {
      this.scroll.nativeElement.scrollTop=this.scroll.nativeElement.scrollHeight
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.msglist.changes.subscribe(()=>this.scrollDown())
    this.scrollDown()
  }

  ngOnChanges(): void {
  }

}
