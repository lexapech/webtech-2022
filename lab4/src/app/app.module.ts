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
import { SigninComponent } from './signin/signin.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { SignupComponent } from './signup/signup.component';
import {MatIconModule} from "@angular/material/icon";
import { MainComponent } from './main/main.component';
import {MatListModule} from "@angular/material/list";

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
    imports: [BrowserModule, RouterOutlet, BrowserAnimationsModule, MatSliderModule, AppRoutingModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule],
  declarations: [ AppComponent, SigninComponent, SignupComponent, MainComponent ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory }
  ]
})
export class AppModule { }
