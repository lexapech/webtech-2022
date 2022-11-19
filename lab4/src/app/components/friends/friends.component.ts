import { Component, OnInit } from '@angular/core';
import FriendInfo from "../../model/user/FriendInfo";
import {ProfileService} from "../../services/profile.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ConfirmComponent} from "../confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import AppSettings from "../../AppSettings";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.less']
})
export class FriendsComponent implements OnInit {
  displayList:FriendInfo[]=[]
  friends:FriendInfo[]=[]
  reqs:FriendInfo[]=[]
  all:boolean=true
  isMine:boolean=false
  constructor(private profileService: ProfileService,private route: ActivatedRoute,private titleService:Title,private dialog: MatDialog,private http:HttpClient) {

  }

  deleteFriend(friendId:string){
    //console.log(postId)
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '350px',
      data: 'Вы уверены, что хотите удалить этого пользователя из друзей?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result===true) {
        this.http.delete<{status:string}>(AppSettings.API_ENDPOINT+`friends?id=${friendId.replace("id","")}`).subscribe(x=>{
          if(x.status==="ok") {
            this.friends=this.friends.filter((friend)=>friend.id!==friendId)
          }
        })
      }
    });
  }

  addFriend(id:string){
    this.profileService.addFriend(id.replace("id","")).subscribe(x=>{
      if (x.status==="true") {
        this.loadMyFriends()
      }
    })
  }


  changePage(event:any) {
    if(event) {
      this.all = event === "all"
      if(this.all && this.isMine) {
        this.displayList=this.friends
      }
      else {
        this.displayList=this.reqs

      }
    }
  }


  ngOnInit()  {
    this.route.queryParams.subscribe(params=>{
      let id = params["id"]
      if(id) this.loadUserFriends("id"+id)
      else this.loadMyFriends()
    })
  }

  loadMyReq(){
    this.isMine=true
    this.profileService.getReq().subscribe(
      x=>this.reqs=x.friends
    )
  }

  loadMyFriends(){
    this.isMine=true
    this.loadMyReq()
    this.profileService.getFriends("").subscribe(x=>{
      this.friends=x.friends
      this.displayList=this.friends
    })

  }
  loadUserFriends(id:string) {
    this.isMine=false
    this.profileService.getFriends(id).subscribe(x=>{
        this.titleService.setTitle("Друзья "+x.genitive.first+" "+x.genitive.last)
        this.friends=x.friends
      this.displayList=this.friends
  })
  }
}
