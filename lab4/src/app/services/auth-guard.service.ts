import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService : AuthService, private route : Router) {

  }

  canActivate() : Observable<boolean>{
    return this.authService.isAuthenticated().pipe(map(x=>{
      if(x){
        return true;
      }
      this.route.navigate(['login']);
      return false;
    }))

  }
}
