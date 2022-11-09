import * as Rollbar from 'rollbar'; // When using Typescript < 3.6.0.
// `import Rollbar from 'rollbar';` is the required syntax for Typescript 3.6.x.
// However, it will only work when setting either `allowSyntheticDefaultImports`
// or `esModuleInterop` in your Typescript options.

import { BrowserModule } from '@angular/platform-browser';
import {
  Injectable,
  InjectionToken,
  NgModule,
  ErrorHandler, Inject
} from '@angular/core';
import { AppComponent } from './app.component';
import {RouterOutlet} from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import { SigninComponent } from './components/signin/signin.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { SignupComponent } from './components/signup/signup.component';
import {MatIconModule} from "@angular/material/icon";
import { MainComponent } from './components/main/main.component';
import {MatListModule} from "@angular/material/list";
import { NewsComponent } from './components/news/news.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessagesComponent } from './components/messages/messages.component';
import { FriendsComponent } from './components/friends/friends.component';
import { DialogComponent } from './components/dialog/dialog.component';
import {MatMenuModule} from "@angular/material/menu";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthService} from "./services/auth.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {AuthInterceptor} from "./services/auth-interceptor.service";
import {SocketIoModule} from "ngx-socket-io";
import AppSettings from "./AppSettings";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { NotificationComponent } from './components/notification/notification.component';

const rollbarConfig = {
  accessToken: 'ad5ead79d3a24da9855f883a57ca970c',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err:any) : void {
    this.rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
    imports: [MatSnackBarModule, SocketIoModule.forRoot(AppSettings.SOCKET_CONFIG), HttpClientModule, BrowserModule, RouterOutlet, BrowserAnimationsModule, MatSliderModule, AppRoutingModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule, MatMenuModule, FormsModule, ReactiveFormsModule, MatButtonToggleModule],
  declarations: [ AppComponent, SigninComponent, SignupComponent, MainComponent, NewsComponent, ProfileComponent, MessagesComponent, FriendsComponent, DialogComponent, NotificationComponent ],
  bootstrap: [ AppComponent ],
  providers: [
      AuthService,
      AuthGuardService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory }
  ]
})
export class AppModule { }
