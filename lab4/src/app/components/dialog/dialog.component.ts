import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges, OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import {Location} from "@angular/common";
import {DialogService} from "../../services/dialog.service";
import {ProfileService} from "../../services/profile.service";
import {ActivatedRoute, Router} from "@angular/router";
import UserInfo from "../../model/user/UserInfo";
import Message from "../../model/user/Message";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  messageText:string=""
  @ViewChild("scroll") scroll!: ElementRef
  @ViewChildren("msglist") msglist!: QueryList<ElementRef>
  user : UserInfo = new UserInfo()
  userId:string | null;
  messages:{msg:Message,mine:boolean}[]=[]


  constructor(private location: Location,private dialogService : DialogService,private profileService : ProfileService,private route: ActivatedRoute,private router :Router) {
    /*this.user = {
      firstname: '',
      midname: "",
      lastname: "",
      birthday: "",
      avatar: "",
      status: "",
      genitive:{first:"",last:""}
    }*/
    this.userId=null
  }

  back() :void {
    this.location.back()
  }

  sendMessage(): void {
    //this.messages.push({text:this.messageText,mine:true})
    if(this.userId)
      this.dialogService.sendMessage(this.userId,this.messageText)
      this.messageText=""
  }

  scrollDown():void {
    if(this.scroll) {
      this.scroll.nativeElement.scrollTop=this.scroll.nativeElement.scrollHeight
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      let id = params["id"]
      if(id) {
        this.userId=id
        this.dialogService.getMessages(id).subscribe(x=>{
          this.messages=[]
          this.messages.push(...x.map((message: Message)=>{
            //message.read=true
            return {msg:message,mine:message.to.toString()===this.userId}
          }))
          })
        this.profileService.getUserInfo(id).subscribe(x=>{
          this.user=x
        })

        this.dialogService.setReadListener((x: Message)=>{
          let read = this.messages.find(msg=>msg.msg.id===x.id)
          if(read)
          {
            read.msg.read=true
          }
        })

        this.dialogService.setMessageListener((x: Message)=>{
            this.messages.push({msg:x,mine:x.to.toString()===this.userId})
        },id)
      }
      else
        this.router.navigate(["/messages"])
    })


  }

  ngAfterViewInit(): void {
    this.msglist.changes.subscribe(()=>this.scrollDown())
    this.scrollDown()
  }

  ngOnChanges(): void {
  }

  ngOnDestroy(): void {
    this.dialogService.destroy()
  }

}
