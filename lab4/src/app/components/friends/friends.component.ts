import { Component, OnInit } from '@angular/core';
import FriendInfo from "../../model/user/FriendInfo";
import {ProfileService} from "../../services/profile.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.less']
})
export class FriendsComponent implements OnInit {
  friends:FriendInfo[]=[]
  constructor(private profileService: ProfileService,private route: ActivatedRoute,private titleService:Title) {

  }

  ngOnInit()  {
    this.route.queryParams.subscribe(params=>{
      let id = params["id"]
      if(id) this.loadUserFriends("id"+id)
      else this.loadMyFriends()
    })
  }
  loadMyFriends(){
    this.profileService.getFriends("").subscribe(x=>this.friends=x.friends)
  }
  loadUserFriends(id:string) {
    this.profileService.getFriends(id).subscribe(x=>{
        this.titleService.setTitle("Друзья "+x.genitive.first+" "+x.genitive.last)
        this.friends=x.friends
  })
  }
}
