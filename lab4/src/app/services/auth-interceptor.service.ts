import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {



  constructor() { }

  getCookie(name:string):string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) { // @ts-ignore
      return parts.pop().split(';').shift();
    }
    return ""
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token=this.getCookie("token")
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization',`Bearer ${token}`),
      })
      return next.handle(authReq)
    }
    return next.handle(req)
  }

}
