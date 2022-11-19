import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import AppSettings from "../AppSettings";
import {map, Observable, Subscription} from "rxjs";
import UserInfo from "../model/user/UserInfo";
import Post from "../model/user/Post";
import {SocketsService} from "./sockets.service";

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  subscriptions: Subscription[]=[]
  constructor(private http : HttpClient,private socketsService : SocketsService) {

  }

  getNews(id:string|undefined) {
    if(id)
      return this.http.get<any>(AppSettings.API_ENDPOINT+`news?id=${id}`).pipe(map(x=>x.news)).pipe(this.processPostInfo)
    else
      return this.http.get<any>(AppSettings.API_ENDPOINT+`news`).pipe(map(x=>x.news)).pipe(this.processPostInfo)
  }

  post(formData:FormData){
    //console.log(formData)
    return this.http.post(AppSettings.API_ENDPOINT+`news`,formData)
  }

  setNewsListener(func:Function) {
    console.log("set lst")
    this.subscriptions.push(this.socketsService.postRecieved$.pipe(map(x=>new Array(x))).pipe(this.processPostInfo).subscribe(x=>{
      console.log(x[0])
        func(x[0])
    }))
  }

  deletePost(postId:string) {
    return this.http.delete<any>(AppSettings.API_ENDPOINT+`news?post=${postId}`)
  }


  subscribe() {
    this.socketsService.subPosts(true)
  }
  unsubscribe() {
    this.socketsService.subPosts(false)
    for(let sub of this.subscriptions)
      sub.unsubscribe()
  }

  processPostInfo(news:Observable<Post[]>):Observable<Post[]> {
    const options = { year: 'numeric', month: 'long', day: 'numeric',hour:"numeric",minute:"numeric"};
    return news.pipe(map(x=>{
      for(let post of x) {
        if(post.date)
        { // @ts-ignore
          post.date=new Date(post.date).toLocaleString(undefined,options)
        }
        else post.date=""
      }
      return x
    }))
  }
}
