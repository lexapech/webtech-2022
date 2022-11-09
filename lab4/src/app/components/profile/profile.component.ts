import { Component, OnInit } from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import UserInfo from "../../model/user/UserInfo";
import {ActivatedRoute, Router} from "@angular/router";
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
  userInfo : UserInfo = new UserInfo()
  userId:string | null
  pictures: string[]=[]
  pictures4: string[]=[]
  loadPicture:boolean=false
  selected:File |null=null;
  constructor(private profileService: ProfileService,private route: ActivatedRoute,private titleService:Title,private router:Router) {
    this.userId=null
  }

  ngOnInit()  {
    this.route.url.pipe(map(segments => segments.join(''))).subscribe(url=>{
      url.startsWith("me")?
          this.loadMyPage():
          this.loadUserPage(url)
    })
  }




  getFriendsQuery(){
    if(this.userId) {
      return {id:this.userId.replace('id','')}
    }
    else return null
  }

  onFileSelected(event:any) {
    if(event.target.files.length > 0)
    {
      this.selected=event.target.files[0]
      this.loadPhoto()
    }
    else
      this.selected=null;
  }

  loadPhoto() {
    if(this.selected)
      this.profileService.upload(this.selected).subscribe(x=>{
        this.profileService.loadPictures(this.userInfo.id).subscribe(x=>{this.pictures=x;this.pictures4=x.slice(0,4)})
      })
  }


  loadMyPage(){
    this.profileService.getUserInfo("").pipe(this.profileService.processUserInfo).subscribe(x => {
      this.userInfo=x;
      this.userId=null
      this.profileService.loadPictures(this.userInfo.id).subscribe(x=>{this.pictures=x;this.pictures4=x.slice(0,4)})

    })
    this.profileService.getFriends("").subscribe(x=>this.friends=x.friends)
    this.loadPicture=true
  }
  loadUserPage(id:string) {
    this.profileService.getUserInfo("").subscribe(x=>{
      if(id.replace("id","")===x.id) {
        this.router.navigate(['/me'])
      }
    })
    this.profileService.getUserInfo(id).pipe(this.profileService.processUserInfo).subscribe(x => {

      this.userInfo=x
      this.userId=id
      this.titleService.setTitle(this.userInfo.firstname+" "+this.userInfo.lastname)

    })
    this.profileService.getFriends(id).subscribe(x=>this.friends=x.friends)
    this.profileService.loadPictures(id.replace("id","")).subscribe(x=>{this.pictures=x;this.pictures4=x.slice(0,4)})
    this.loadPicture=false
  }

}
