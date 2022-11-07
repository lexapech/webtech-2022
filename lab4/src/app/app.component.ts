import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import User from "./model/auth/User";
import {ProfileService} from "./services/profile.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit,OnChanges{
  avatar: string=""
  isAdmin: boolean;
  isAuth: boolean = false;
  loggedUser!: User | null
  constructor(public authService : AuthService,private router : Router,private profileService : ProfileService) {
    this.isAdmin=false


  }
  logout() {
    this.authService.logout()
    this.isAuth=false;
    this.router.navigate(['/login'])
  }

  ngOnInit(): void {

    this.authService.currentUser.subscribe({
      next: x=>{
        this.loggedUser=x
        this.isAdmin=this.loggedUser.isAdmin
        this.isAuth=true;
      },
      error: () => {
        this.router.navigate(['/login'])
        this.isAuth=false;
      }
    })

    this.router.events.subscribe(()=>{
      this.authService.currentUser.subscribe({
        next: x=>{
          this.loggedUser=x
          this.isAdmin=this.loggedUser.isAdmin
          this.profileService.currentUser.subscribe(x => {
            this.avatar=x.avatar
            this.isAuth=true;
          })
        },
        error: () => {
          this.isAuth=false;
        }
      })

    })

  }

  ngOnChanges(): void {

  }
}
