import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import User from "./model/auth/User";
import {ProfileService} from "./services/profile.service";
import {SocketsService} from "./services/sockets.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {NotificationComponent} from "./components/notification/notification.component";
import {debounceTime, Observable, Subject, Subscription} from "rxjs";
import UserInfo from "./model/user/UserInfo";

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
  audio = new Audio("assets/notification.mp3")
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  notification: Subscription|undefined
  searchText:string=""
  users:UserInfo[]=[]
  search$:Subject<string>;
  constructor(public authService : AuthService,
              private router : Router,
              private profileService : ProfileService,
              private socketsService : SocketsService,
              private snackBar: MatSnackBar
  ) {
    this.search$=new Subject<string>()

    this.isAdmin=false

    this.search$.pipe(debounceTime(300)).subscribe(str=>{
      this.profileService.search(str).subscribe(x=>{
        this.users=x.users
      })
    })

  }

  searchChange() {
    this.search$.next(this.searchText)

  }


  subscribeMessage() {
    this.notification?.unsubscribe();
    this.notification = this.socketsService.message$.subscribe((message=>{
      if(this.router.url.startsWith("/dialog")) return
      if(this.loggedUser && this.loggedUser.username?.replace("id","")===message.to) {
        this.profileService.getUserInfo(message.from).subscribe(x=>{
          this.audio.play()
          this.snackBar.openFromComponent(NotificationComponent,{
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: 'snackbar-panel',
            duration: 3000,
            data:{info:x,msg:message}
          })

        })

      }
    }))
  }



  logout() {
    this.authService.logout()
    this.isAuth=false;
    this.socketsService.logout()

    this.notification?.unsubscribe()

    this.router.navigate(['/login'])
  }

  ngOnInit(): void {

    this.authService.currentUser.subscribe({
      next: x=>{
        this.loggedUser=x
        this.isAdmin=this.loggedUser.isAdmin
        this.isAuth=true;
        this.socketsService.login()
        this.subscribeMessage()
      },
      error: () => {
        this.router.navigate(['/login'])
        this.isAuth=false;
        this.socketsService.logout()
        this.notification?.unsubscribe()
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
            this.socketsService.login()
            this.subscribeMessage()
          })
        },
        error: () => {
          this.isAuth=false;
          this.socketsService.logout()
          this.notification?.unsubscribe()
        }
      })

    })

  }


  ngOnChanges(): void {

  }
}
