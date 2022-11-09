import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import AppSettings from "../AppSettings";
import {map, Observable} from "rxjs";
import UserInfo from "../model/user/UserInfo";
import Post from "../model/user/Post";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http : HttpClient) { }

  getNews(id:string|undefined) {
    if(id)
      return this.http.get<any>(AppSettings.API_ENDPOINT+`news?id=${id}`).pipe(map(x=>x.news)).pipe(this.processPostInfo)
    else
      return this.http.get<any>(AppSettings.API_ENDPOINT+`news`).pipe(map(x=>x.news)).pipe(this.processPostInfo)
  }

  post(formdata:FormData){
    console.log(formdata)
    return this.http.post(AppSettings.API_ENDPOINT+`news`,formdata)
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
