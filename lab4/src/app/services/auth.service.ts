import { Injectable } from '@angular/core';
import {Observable, of, tap, map, Subject} from "rxjs";
import LoginRequest from "../model/auth/LoginRequest";
import User from "../model/auth/User";
import {HttpClient} from "@angular/common/http";
import SignupRequest from "../model/auth/SignupRequest";
import AppSettings from "../AppSettings";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private loggedUser: User | null = null;
    private loggedUser$!: Subject<User>;
    private isAuth : boolean | undefined =undefined
    private counter=0
  constructor(private http: HttpClient) {
    this.currentUser;

  }

  private deleteCookie(name:string) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }


  public isAuthenticated() : Observable<Boolean> {
        if(this.isAuth===undefined)
            return this.currentUser.pipe(map(x=>!!x));
        else
            return of(this.isAuth)
  }

  clearLogged(){
      console.log("clear")
      this.loggedUser=null
  }

  get currentUser(): Observable<User> {
    if(this.loggedUser) {

        return of(this.loggedUser)
    }
    else {
        if(!this.loggedUser$ || this.loggedUser$.closed) {
            this.loggedUser$=new Subject<User>()
            this.http.get<any>(AppSettings.AUTH_ENDPOINT+'logged').pipe(tap(data => {
                    this.isAuth=true;
                    this.loggedUser = {username: data.username, isAdmin: data.isAdmin};
            })).subscribe({
                next: x => {this.loggedUser$.next(x);this.loggedUser$.unsubscribe()},
                error: error => {
                    this.loggedUser = null
                    this.isAuth=false;
                    this.loggedUser$.error(error);
                    this.loggedUser$.unsubscribe()
                }
            })
        }
        return this.loggedUser$
    }
  }

  login(loginRequest: LoginRequest): Observable<Object> {
    return this.http.post<any>(AppSettings.AUTH_ENDPOINT+'login', loginRequest)
        .pipe(map(data => {
          if(data.user) {
              document.cookie = `token=${data.user}`
          }
          else {
                console.log(data)
          }
            return data.message
        }));
  }

  signup(signupRequest : SignupRequest): Observable<Object> {
    return this.http.post<any>(AppSettings.AUTH_ENDPOINT+'signup', signupRequest)
        .pipe(map(data => {
            if(data.user) {
                document.cookie = `token=${data.user}`
            }
            else {
                console.log(data)
            }
            return data.message
        }));
  }

  logout() {
      this.deleteCookie("token");
      this.loggedUser=null;
      this.isAuth=false;
  }

}
