import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SigninComponent} from "./components/signin/signin.component";
import {SignupComponent} from "./components/signup/signup.component";
import {MainComponent} from "./components/main/main.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {NewsComponent} from "./components/news/news.component";
import {MessagesComponent} from "./components/messages/messages.component";
import {FriendsComponent} from "./components/friends/friends.component";
import {DialogComponent} from "./components/dialog/dialog.component";
import {AuthGuardService as AuthGuard} from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login',component: SigninComponent,title:"Войти в ФСБook"},
  { path: 'signup',component: SignupComponent,title:"Регистрация в ФСБook"},
    { path: '',   redirectTo: '/me', pathMatch: 'full' },
  { path: '',component: MainComponent,canActivate: [AuthGuard] ,children:[
      { path: 'me',component: ProfileComponent,title:"Моя страница"},
          { path: 'news',component: NewsComponent,title:"Новости"},
          { path: 'messages',component: MessagesComponent,title:"Сообщения"},
          { path: 'friends',component: FriendsComponent,title:"Друзья"},
          { path: 'dialog',component: DialogComponent,title:"Cообщения"},
          { path: ':id',component: ProfileComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
