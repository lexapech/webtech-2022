import { Injectable } from '@angular/core';
import {map, Observable, of, Subject, tap} from "rxjs";
import UserInfo from "../model/user/UserInfo";
import {HttpClient} from "@angular/common/http";
import FriendInfo from "../model/user/FriendInfo";
import AppSettings from "../AppSettings";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    _currentUser:UserInfo | null
    currentUser$!: Subject<UserInfo>
  constructor(private http: HttpClient) {
        this._currentUser=null;
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


  processUserInfo(user:Observable<UserInfo>):Observable<UserInfo> {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
