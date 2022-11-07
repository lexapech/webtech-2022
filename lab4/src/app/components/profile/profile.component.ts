import { Component, OnInit } from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import UserInfo from "../../model/user/UserInfo";
import {ActivatedRoute} from "@angular/router";
import { map} from "rxjs";
import {Title} from "@angular/platform-browser";
import FriendInfo from "../../model/user/FriendInfo";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  avatar=""
  friends:FriendInfo[]=[]
  userInfo : UserInfo

  constructor(private profileService: ProfileService,private route: ActivatedRoute,private titleService:Title) {
    this.userInfo = {
      firstname: '',
      midname: "",
      lastname: "",
      birthday: "",
      avatar: "",
      status: ""
    }
  }

  ngOnInit()  {
    this.route.url.pipe(map(segments => segments.join(''))).subscribe(url=>{
      url.startsWith("me")?
          this.loadMyPage():
          this.loadUserPage(url)
    })
  }
  loadMyPage(){
    this.profileService.getUserInfo("").pipe(this.profileService.processUserInfo).subscribe(x => {this.userInfo=x})
    this.profileService.getFriends("").subscribe(x=>this.friends=x.friends)
  }
  loadUserPage(id:string) {
    this.profileService.getUserInfo(id).pipe(this.profileService.processUserInfo).subscribe(x => {
      this.userInfo=x
      this.titleService.setTitle(this.userInfo.firstname+" "+this.userInfo.lastname)
    })
    this.profileService.getFriends(id).subscribe(x=>this.friends=x.friends)
  }

}
