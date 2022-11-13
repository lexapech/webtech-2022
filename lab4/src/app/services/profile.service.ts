import { Injectable } from '@angular/core';
import {filter, map, Observable, of, Subject, tap} from "rxjs";
import UserInfo from "../model/user/UserInfo";
import {HttpClient} from "@angular/common/http";
import FriendInfo from "../model/user/FriendInfo";
import AppSettings from "../AppSettings";
import {NewsService} from "./news.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    _currentUser:UserInfo | null
    currentUser$!: Subject<UserInfo>
  constructor(private http: HttpClient,private newsService : NewsService) {
        this._currentUser=null;
  }

    deleteFriend(id:string) {
        return this.http.delete<{status:string}>(AppSettings.API_ENDPOINT+`friends?id=${id}`)
    }

    addFriend(id:string) {
        return this.http.get<{status:string}>(AppSettings.API_ENDPOINT+`addfriend?id=${id}`)
    }

    isFriend(id:string) {
        return this.http.get<{status:string}>(AppSettings.API_ENDPOINT+`isfriend?id=${id}`)
    }

  get currentUser() : Observable<UserInfo> {
        if(this._currentUser)
            return of(this._currentUser)
        else {
            if(!this.currentUser$) {
                this.currentUser$ = new Subject<UserInfo>()
                this.getUserInfo("").pipe(this.processUserInfo).pipe(tap(x=>this._currentUser=x)).subscribe(x=>this.currentUser$.next(x))
            }
            return this.currentUser$
        }

    }

    upload(file:File,setAvatar:boolean) {
        let formData=new FormData()
        formData.append("text","")
        if(file) {
            formData.append("image",file)
            formData.append("avatar",setAvatar.toString())
        }

        return this.newsService.post(formData)
    }


    loadPictures(userId:string){
        return this.newsService.getNews(userId)
            .pipe(map(posts=>posts.filter(post=>post.content.image)))
            .pipe(map(posts=>posts.map(post=>post.content.image)))
    }


  getUserInfo(userId:string) : Observable<UserInfo> {
      if(userId!=="")
          return this.http.get<any>(AppSettings.API_ENDPOINT+`user?id=${userId.replace("id","")}`)
      else
          return this.http.get<any>(AppSettings.API_ENDPOINT+`user`)
  }

  getFriends(userId:string): Observable<{friends:FriendInfo[],genitive: { first:string,last:string }}> {
      if(userId!=="")
          return this.http.get<any>(AppSettings.API_ENDPOINT+`friends?id=${userId.replace("id","")}`)
      else
          return this.http.get<any>(AppSettings.API_ENDPOINT+`friends`)
  }

    getReq(): Observable<{friends:FriendInfo[],genitive: { first:string,last:string }}> {
        return this.http.get<any>(AppSettings.API_ENDPOINT+`pending`)
    }

    search(query:string) {
        return this.http.get<any>(AppSettings.API_ENDPOINT+`users?search=${query}`)
    }



  processUserInfo(user:Observable<UserInfo>):Observable<UserInfo> {
      const options = { year: 'numeric', month: 'long', day: 'numeric'};
      return user.pipe(map(x=>{
          if(x.birthday)
            { // @ts-ignore
                x.birthday=new Date(x.birthday).toLocaleDateString(undefined,options)
            }
            else x.birthday=""
          return x
      }))
  }

}
